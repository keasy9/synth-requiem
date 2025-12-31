import {Component, type Eventable, EventEmitter, type Handler} from 'excalibur';
import {DomBlurEvent, DomClickEvent, DomFocusEvent, DomMouseEnterEvent, DomMouseLeaveEvent} from '@/helpers/events/DomEvents.ts';

interface DomComponentEvents {
    focus: DomFocusEvent;
    blur: DomBlurEvent;
    click: DomClickEvent;
    mouseenter: DomMouseEnterEvent;
    mouseleave: DomMouseLeaveEvent;
}

const DomEvents = {
    Focus: 'focus',
    Blur: 'blur',
    Click: 'click',
    MouseEnter: 'mouseenter',
    MouseLeave: 'mouseleave',
} as const;

export const DomPositionAnchor = {
    // по центру экрана
    Center: 'center',
    // на всю ширину, внизу экрана
    Bottom: 'bottom',
} as const;

export const DomElementType = {
    // прогрессбар
    Bar: 'bar',
    // кнопка
    Button: 'button',
    // контейнер для других элементов
    Container: 'container',
    // изображение
    Sprite: 'sprite',
    // текст со вставками
    Textbox: 'textbox',
} as const;

export abstract class DomComponent extends Component implements Eventable {
    /**
     * Dom элемент.
     * @protected
     */
    protected _element?: HTMLElement;

    /**
     * Кэш стилей. Нужен на случай когда элемент ещё не был создан, но стили уже устанавливаются.
     * @protected
     */
    protected _queuedStyles: Record<string, string> = {};

    /**
     * Тип элемента.
     */
    protected _type: typeof DomPositionAnchor[keyof typeof DomPositionAnchor] = DomPositionAnchor.Center;

    /**
     * Позиция элемента. Учитывается только у абсолютно-позиционированных элементов (без родителя).
     */
    public anchor: typeof DomPositionAnchor[keyof typeof DomPositionAnchor] = DomPositionAnchor.Center;

    /**
     * События элемента.
     */
    public events: EventEmitter<DomComponentEvents> = new EventEmitter<DomComponentEvents>();

    /**
     * Dom элемент.
     */
    public get element(): undefined|HTMLElement {
        return this._element;
    }

    /**
     * Dom элемент.
     */
    public set element(element: undefined|HTMLElement) {
        this.destroyEvents();

        this._element = element;

        this.initEvents();
        this.applyQueuedStyles();
    }

    /**
     * Подписывается на события dom-элемента.
     * @protected
     */
    protected initEvents(): void {
        if (!this._element) return;

        this._element.addEventListener('focus', this.onDomEvent.bind(this));
        this._element.addEventListener('blur', this.onDomEvent.bind(this));
        this._element.addEventListener('click', this.onDomEvent.bind(this));
        this._element.addEventListener('mouseenter', this.onDomEvent.bind(this));
        this._element.addEventListener('mouseleave', this.onDomEvent.bind(this));
    }

    /**
     * Отписывается от событий dom-элемента.
     * @protected
     */
    protected destroyEvents(): void {
        if (!this._element) return;

        this._element.removeEventListener('focus', this.onDomEvent.bind(this));
        this._element.removeEventListener('blur', this.onDomEvent.bind(this));
        this._element.removeEventListener('click', this.onDomEvent.bind(this));
        this._element.removeEventListener('mouseenter', this.onDomEvent.bind(this));
        this._element.removeEventListener('mouseleave', this.onDomEvent.bind(this));
    }

    /**
     * Обработка событий dom-элемента.
     * @protected
     */
    protected onDomEvent(ev: Event): void {
        if (!ev.isTrusted) return; // предотвращаем зацикливание пользовательских событий

        switch (ev.type) {
            case DomEvents.Focus:
                this.events.emit(DomEvents.Focus, new DomFocusEvent(this._element, this, ev))
                break;
            case DomEvents.Blur:
                this.events.emit(DomEvents.Focus, new DomBlurEvent(this._element, this, ev))
                break;
            case DomEvents.Click:
                this.events.emit(DomEvents.Focus, new DomClickEvent(this._element, this, ev))
                break;
            case DomEvents.MouseLeave:
                this.events.emit(DomEvents.Focus, new DomMouseEnterEvent(this._element, this, ev))
                break;
            case DomEvents.MouseEnter:
                this.events.emit(DomEvents.Focus, new DomMouseLeaveEvent(this._element, this, ev))
                break;
        }
    }

    /**
     * Применить закэшированные стили к элементу.
     * @protected
     */
    protected applyQueuedStyles(): void {
        if (!this._element) return;

        for (const [prop, val] of Object.entries(this._queuedStyles)) {
            this._element.style.setProperty(prop, val);
        }

        this._queuedStyles = {};
    }

    /**
     * @inheritDoc
     */
    public emit(eventName: typeof DomEvents[keyof typeof DomEvents], event?: DomComponentEvents[keyof DomComponentEvents]) {
        switch (eventName) {
            case DomEvents.Focus:
                event ??= new DomFocusEvent(this._element, this);
                this._element?.focus();
                break;
            case DomEvents.Blur:
                event ??= new DomBlurEvent(this._element, this);
                this._element?.blur();
                break;
            case DomEvents.Click:
                event ??= new DomClickEvent(this._element, this);
                this._element?.click();
                break;
            case DomEvents.MouseEnter:
                event ??= new DomMouseEnterEvent(this._element, this);
                this._element?.dispatchEvent(new MouseEvent('mouseenter'));
                break;
            case DomEvents.MouseLeave:
                event ??= new DomMouseLeaveEvent(this._element, this);
                this._element?.dispatchEvent(new MouseEvent('mouseleave'));
                break;
        }

        this.events.emit(eventName, event);
    }

    /**
     * @inheritDoc
     */
    public off(eventName: typeof DomEvents[keyof typeof DomEvents], handler?: Handler<DomComponentEvents[keyof DomComponentEvents]>): void {
        if (handler) this.events.off(eventName, handler);
        else this.events.clear();
    }

    /**
     * @inheritDoc
     */
    public on(eventName: typeof DomEvents[keyof typeof DomEvents], handler: Handler<DomComponentEvents[keyof DomComponentEvents]>): void {
        this.events.on(eventName, handler);
    }

    /**
     * @inheritDoc
     */
    public once(eventName: typeof DomEvents[keyof typeof DomEvents], handler: Handler<DomComponentEvents[keyof DomComponentEvents]>): void {
        this.events.once(eventName, handler);
    }

    /**
     * Установить стили элемента. Если dom-элемент ещё не создан, стили будут применены к нему сразу после создания.
     * @param key
     * @param value
     */
    public setStyle(key: string, value: string): this {
        if (this._element) this._element.style.setProperty(key, value);
        else this._queuedStyles[key] = value;

        return this;
    }

    // todo сеттеры и геттеры для часто используемых стилей
    // todo потомки этого класса с разными типами элементов и уникальной логикой в зависимости от типа
}
