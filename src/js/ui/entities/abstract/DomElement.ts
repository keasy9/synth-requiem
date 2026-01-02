import {ActionsComponent, type Engine, Entity} from 'excalibur';
import {type AnyDomElementType, DomComponent} from '@/ui/components/DomComponent.ts';
import {UiDtoState, UiElementsState} from '@/ui/State.ts';
import {type Reactive} from 'vue';
import type {EnumValue} from '@/utils/types.ts';

export const DomPositionAnchor = {
    // по центру экрана
    Center: 'center',
    // на всю ширину, внизу экрана
    Bottom: 'bottom',
} as const;

export type AnyDomPositionAnchor = EnumValue<typeof DomPositionAnchor>;

export interface DomElementDto {
    type: AnyDomElementType;
    anchor: AnyDomPositionAnchor;
    id: number,
}

export abstract class DomElement extends Entity<DomComponent | ActionsComponent> {
    public name = `DomEl#${this.id}`;

    protected abstract _dto: Reactive<DomElementDto>;

    public get dto(): Reactive<DomElementDto> {
        return this._dto;
    }

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
        this.dto.anchor = anchor;
        return this;
    }

    /**
     * @inheritDoc
     */
    public onAdd(_: Engine) {
        if (!this.parent) {
            UiDtoState[this.id] = this._dto;
            UiElementsState[this.id] = this;
        }
    }

    /**
     * @inheritDoc
     */
    public onRemove(_: Engine) {
        delete UiDtoState[this.id];
        delete UiElementsState[this.id];
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
}
