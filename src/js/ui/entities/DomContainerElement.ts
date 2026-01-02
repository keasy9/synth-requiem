import {DomElement} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';
import type {EnumValue, MaybeReactive} from '@/utils/types.ts';
import {UiState} from '@/ui/State.ts';

export const DomContainerLayout = {
    Rows: 'rows',
    Cols: 'cols',
    Grid: 'grid',
} as const;

export type AnyDomContainerLayout = EnumValue<typeof DomContainerLayout>

export class DomContainerElement<TChildren extends MaybeReactive<DomElement> = MaybeReactive<DomElement>> extends DomElement {
    public name = `DomContainer#${this.id}`;

    public layout: AnyDomContainerLayout = DomContainerLayout.Rows;

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
    public addChild<TChild extends MaybeReactive<DomElement> = MaybeReactive<DomElement>>(entity: TChild): DomContainerElement<TChild | TChildren> {
        delete UiState[entity.id];
        return super.addChild(entity) as DomContainerElement<TChild | TChildren>;
    }

    /**
     * Добавить элементы в контейнер.
     * @param entity
     */
    public addChildren<TChild extends MaybeReactive<DomElement> = MaybeReactive<DomElement>>(...entity: TChild[]): DomContainerElement<TChild | TChildren> {
        entity.forEach(child => this.addChild(child));
        return this as DomContainerElement<TChild | TChildren>;
    }

    /**
     * @inheritDoc
     */
    public removeChild(entity: TChildren): this {
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
        this.layout = layout;
        return this;
    }

    /**
     * Расположить элементы колонками.
     */
    public setColsLayout(): this {
        this.layout = DomContainerLayout.Cols;
        return this;
    }

    /**
     * Расположить элементы рядами.
     */
    public setRowsLayout(): this {
        this.layout = DomContainerLayout.Rows;
        return this;
    }

    /**
     * Расположить элементы по сетке.
     */
    public setGridLayout(): this {
        this.layout = DomContainerLayout.Grid;
        return this;
    }
}