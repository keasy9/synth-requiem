import {ActionsComponent, type Engine, Entity} from 'excalibur';
import {type AnyDomElementType, DomComponent, DomPositionAnchor} from '@/ui/components/DomComponent.ts';
import {UiState} from '@/ui/State.ts';
import {type Reactive, reactive} from 'vue';
import type {EnumValue} from '@/utils/types.ts';

// TODO по сравнению с DTO получились тормоза. Попробовать отказаться от vue в сторону прямой манипуляции dom-элементами
export abstract class DomElement extends Entity<DomComponent | ActionsComponent> {
    public name = `DomEl#${this.id}`;

    public get element(): DomComponent {
        return this.get(DomComponent);
    }

    public get actions(): ActionsComponent {
        return this.get(ActionsComponent); // todo custom actions component
    }

    constructor(type: AnyDomElementType) {
        super([new DomComponent(type), new ActionsComponent()]);
    }

    /**
     * @inheritDoc
     */
    public _initialize(engine: Engine) {
        super._initialize(engine);
        for (const child of this.children) {
            child._initialize(engine);
        }
    }

    /**
     * Установить позицию элемента. Учитывается только у абсолютно-позиционированных элементов (без родителя).
     * @param anchor
     */
    public setAnchor(anchor: EnumValue<typeof DomPositionAnchor>): this {
        this.element.anchor = anchor;
        return this;
    }

    /**
     * @inheritDoc
     */
    public onAdd(_: Engine) {
        if (!this.parent) UiState[this.id] = this;
    }

    /**
     * @inheritDoc
     */
    public onRemove(_: Engine) {
        delete UiState[this.id];
    }

    /**
     * Установить стили элемента.
     * В качестве значения можно передать число или массив чисел для таких свойств как padding, margin, border-width.
     * @param key
     * @param value
     */
    public setStyle(key: string, value: string|number|number[]): this {
        this.element.setStyle(key, value);
        return this;
    }

    /**
     * Сбросить стили элемента.
     * @param key
     */
    public clearStyle(key: string): this {
        this.element.clearStyle(key);
        return this;
    }

    /**
     * Возвращает реактивную обёртку элемента.
     * Если планируется модифицировать элемент, рекомендуется использовать его реактивную обёртку, чтобы состояние корректно обновлялось.
     */
    public reactive(): Reactive<this> {
        return reactive(this);
    }
}
