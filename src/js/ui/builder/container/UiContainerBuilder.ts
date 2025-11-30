import {UiElemBuilder} from '@/ui/builder/UiElemBuilder.ts';
import {type AnyUiContainerLayout, UiContainerDto, UiContainerLayout} from '@/ui/builder/container/UiContainerDto.ts';
import type {UiElemDto} from '@/ui/builder/UiElemDto.ts';
import {type Reactive, reactive} from 'vue';

export class UiContainerBuilder extends UiElemBuilder {
    protected _children: Reactive<UiElemDto>[] = [];
    protected _layout: AnyUiContainerLayout = UiContainerLayout.Rows;
    protected _gap: number = 0;

    /**
     * Расположить элементы контейнера строками.
     */
    public asRows(): this {
        this._layout = UiContainerLayout.Rows;
        return this;
    }

    /**
     * Расположить элементы контейнера колонками
     */
    public asCols(): this {
        this._layout = UiContainerLayout.Cols;
        return this;
    }

    /**
     * Расположить элементы контейнера по сетке.
     */
    public asGrid(): this {
        this._layout = UiContainerLayout.AutoGrid;
        return this;
    }

    /**
     * Установить способ расположения элементов контейнера.
     * @param layout
     */
    public layout(layout: AnyUiContainerLayout): this {
        this._layout = layout;
        return this;
    }

    /**
     * Устновить отступ между элементами контейнера.
     * @param gap
     */
    public gap(gap: number): this {
        this._gap = gap;
        return this;
    }

    /**
     * Добавить в контейнер элементы. Можно передавать билдеры элементов.
     * @param children
     */
    public with(...children: (UiElemDto|UiElemBuilder|Reactive<UiElemDto>)[]): this {
        children.forEach(child => {
            if (child instanceof UiElemBuilder) this._children.push(child.get());
            else this._children.push(child);
        });

        return this;
    }

    /**
     * @inheritDoc
     */
    public get(): Reactive<UiContainerDto> {
        const instance = reactive(new UiContainerDto());

        instance.children = this._children;
        instance.layout = this._layout;
        instance.anchor = this._anchor;
        instance.gap = this._gap;

        return instance;
    }

    /**
     * @inheritDoc
     */
    public show(): Reactive<UiContainerDto> {
        const dto = this.get();

        dto.show();

        return dto;
    }
}