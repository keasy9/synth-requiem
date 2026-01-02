import {DomElement, type DomElementDto, DomPositionAnchor} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';
import {type Engine, type EntityEvents, type Handler, Timer, GameEvent, type EventKey, type Subscription} from 'excalibur';
import {GAME} from '@/main.ts';
import type {Reactive} from 'vue';
import {reactive} from 'vue';

export class AnimationEndEvent<T> extends GameEvent<T> {
    engine: Engine;
    self: T;
    constructor(engine: Engine, self: T) {
        super();
        this.engine = engine;
        this.self = self;
    }
}

export interface DomTextboxEvents extends EntityEvents {
    animationend: AnimationEndEvent<DomTextboxElement>;
}

export interface DomTextboxDto extends DomElementDto {
    type: typeof DomElementType.Textbox;
    content?: string;
}

export class DomTextboxElement extends DomElement {
    public name = `DomTextbox#${this.id}`;

    protected _dto: Reactive<DomTextboxDto> = reactive({
        type: DomElementType.Textbox,
        anchor: DomPositionAnchor.Center,
        id: this.id,
    });

    protected _typingTimer?: Timer;
    protected _typingSource?: HTMLElement;
    protected _typingIndexes: number[] = [];

    constructor() {
        super(DomElementType.Textbox);
    }

    /**
     * Установить контент.
     * @param html
     */
    public setContent(html: string): this {
        this._dto.content = html;
        return this;
    }

    public addChild(_: DomElement): this {
        throw new Error('Нельзя добавлять дочерние элементы в текстовый контейнер!');
        return this;
    }

    /**
     * Запустить анимацию печати текста.
     * @param symbolDelay
     * @param html
     * @param onEnd
     */
    public animateTyping(symbolDelay: 40, html?: string, onEnd?: Handler<AnimationEndEvent<DomTextboxElement>>): this {
        if (html) this._dto.content = html;
        if (onEnd) this.on('animationend', onEnd);

        if (!this._typingTimer) {
            this._typingTimer = new Timer({
                interval: symbolDelay,
                repeats: true,
                numberOfRepeats: -1,
                action: () => this.typeText(),
            });

            GAME.add(this._typingTimer);
        } else {
            this._typingTimer.reset(symbolDelay);
        }

        this._typingTimer.start();

        this._typingSource = document.createElement('span');
        this._typingSource.innerHTML = this._dto.content ?? '';
        this._typingIndexes = [];

        return this;
    }

    /**
     * Поставить анимацию на паузу.
     */
    public pauseAnimation(): this {
        this._typingTimer?.pause();
        return this;
    }

    /**
     * Продолжить анимацию. Если анимация не была начата, ничего не произойдёт.
     */
    public continueAnimation(): this {
        this._typingTimer?.resume();
        return this;
    }

    /**
     * Остановить анимацию и вывести текст полностью.
     */
    public stopAnimation(): this {
        this._typingTimer?.stop();
        delete this._typingSource;
        this._typingIndexes = [];

        return this;
    }

    protected sliceContent(elem: HTMLElement, level: number = 0): string {
        this._typingIndexes[level] ??= 0;
        const currentIndex = this._typingIndexes[level];

        if (elem.nodeName === '#text') {
            // сейчас печатается текст

            if (currentIndex >= elem.textContent.length - 1) {
                // вместо добавления последнего символа выводим весь текст
                this._typingIndexes = this._typingIndexes.slice(0, -1);
                if (this._typingIndexes.length) this._typingIndexes[level - 1]!++;
                return elem.textContent;
            }

            this._typingIndexes[level]++;

            return elem.textContent.slice(0, currentIndex + 1);

        } else {
            // печатается вложенный элемент

            if (currentIndex >= elem.childNodes.length) {
                this._typingIndexes = this._typingIndexes.slice(0, -1);
                if (this._typingIndexes.length) this._typingIndexes[level - 1]!++;

                if (level === 0) {
                    this.stopAnimation();

                    this.emit('animationend', new AnimationEndEvent<DomTextboxElement>(GAME, this))

                    return elem.innerHTML;
                }

                return elem.outerHTML;
            }

            const textParts = ([...elem.childNodes] as HTMLElement[])
                .slice(0, currentIndex)
                .map(el => el.nodeName === '#text' ? el.textContent : el.outerHTML);

            // todo сейчас когда элемент полностью напечатался, два раза возвращается одна и та же строка, т.е. есть доп. задержка
            textParts.push(this.sliceContent(elem.childNodes[currentIndex] as HTMLElement, level + 1));

            if (level === 0) return textParts.join('');

            const elemClone = elem.cloneNode(false) as HTMLElement;
            elemClone.innerHTML = textParts.join('');
            return elemClone.outerHTML;
        }
    }

    protected typeText(): void {
        if (!this._typingSource) return;

        // начинаем с первого индекса первого элемента
        if (this._typingIndexes.length < 1) this._typingIndexes.push(0);
        if (this._typingIndexes.length < 2) this._typingIndexes.push(0);

        this._dto.content = this.sliceContent(this._typingSource);
    }

    public emit<TEventName extends EventKey<DomTextboxEvents>>(eventName: TEventName, event?: DomTextboxEvents[TEventName]): void {
        super.emit(eventName, event);
    }

    public on<TEventName extends EventKey<DomTextboxEvents>>(eventName: TEventName, handler: Handler<DomTextboxEvents[TEventName]>): Subscription {
        return super.on(eventName, handler);
    }

    public once<TEventName extends EventKey<DomTextboxEvents>>(eventName: TEventName, handler: Handler<DomTextboxEvents[TEventName]>): Subscription {
        return super.once(eventName, handler);
    }

    public off<TEventName extends EventKey<DomTextboxEvents>>(eventName: TEventName, handler?: Handler<DomTextboxEvents[TEventName]>): void {
        //@ts-ignore
        super.off(eventName, handler);
    }
}
