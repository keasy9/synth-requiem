import {DomElement, type DomElementDto, DomPositionAnchor} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';
import type {EnumValue} from '@/utils/types.ts';
import {UiDtoState, UiElementsState} from '@/ui/State.ts';
import type {Reactive} from 'vue';
import {reactive, toValue} from 'vue';

export const DomContainerLayout = {
    Rows: 'rows',
    Cols: 'cols',
    Grid: 'grid',
} as const;

export type AnyDomContainerLayout = EnumValue<typeof DomContainerLayout>

export interface DomContainerDto extends DomElementDto {
    type: typeof DomElementType.Container;
    layout?: AnyDomContainerLayout;
    children?: DomElementDto[];
}

export class DomContainerElement<TChildren extends DomElement = DomElement> extends DomElement {
    public name = `DomContainer#${this.id}`;

    protected _dto: Reactive<DomContainerDto> = reactive({
        type: DomElementType.Container,
        anchor: DomPositionAnchor.Center,
        id: this.id,
    });

    /**
     * @inheritDoc
     */
    public get children(): readonly TChildren[] {
        return super.children as TChildren[];
    }

    constructor() {
        super(DomElementType.Container);
    }

    /**
     * @inheritDoc
     */
    public addChild<TChild extends DomElement = DomElement>(entity: TChild): DomContainerElement<TChild | TChildren> {
        delete UiDtoState[entity.id];
        UiElementsState[entity.id] = entity;
        this._dto.children ??= [];
        this._dto.children.push(toValue(entity.dto));

        return super.addChild(entity) as DomContainerElement<TChild | TChildren>;
    }

    /**
     * Добавить элементы в контейнер.
     * @param entity
     */
    public addChildren<TChild extends DomElement = DomElement>(...entities: TChild[]): DomContainerElement<TChild | TChildren> {
        entities.forEach(child => this.addChild(child));
        return this as DomContainerElement<TChild | TChildren>;
    }

    /**
     * @inheritDoc
     */
    public removeChild(entity: TChildren): this {
        if (this._dto.children) delete this._dto.children[this._dto.children.findIndex(child => child.id === entity.id)];

        delete UiElementsState[entity.id];

        return super.removeChild(entity) as this;
    }

    /**
     * @inheritDoc
     */
    public hasChild(child: TChildren, recursive?: boolean): boolean {
        return super.hasChild(child, recursive);
    }

    /**
     * Установить порядок отображения вложенных элементов.
     * @param layout
     */
    public setLayout(layout: AnyDomContainerLayout): this {
        this._dto.layout = layout;
        return this;
    }

    /**
     * Расположить элементы колонками.
     */
    public setColsLayout(): this {
        this._dto.layout = DomContainerLayout.Cols;
        return this;
    }

    /**
     * Расположить элементы рядами.
     */
    public setRowsLayout(): this {
        this._dto.layout = DomContainerLayout.Rows;
        return this;
    }

    /**
     * Расположить элементы по сетке.
     */
    public setGridLayout(): this {
        this._dto.layout = DomContainerLayout.Grid;
        return this;
    }
}