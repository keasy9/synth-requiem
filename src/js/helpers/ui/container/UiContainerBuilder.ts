import {UiElemBuilder} from '@/helpers/ui/UiElemBuilder.ts';
import {type AnyUiContainerLayout, UiContainerDto, UiContainerLayout} from '@/helpers/ui/container/UiContainerDto.ts';
import type {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import {UiState} from '@/helpers/ui/State.ts';

export class UiContainerBuilder extends UiElemBuilder {
    protected _children: UiElemDto[] = [];
    protected _layout: AnyUiContainerLayout = UiContainerLayout.Rows;

    public asRows(): this {
        this._layout = UiContainerLayout.Rows;
        return this;
    }

    public asCols(): this {
        this._layout = UiContainerLayout.Cols;
        return this;
    }

    public asGrid(): this {
        this._layout = UiContainerLayout.AutoGrid;
        return this;
    }

    public layout(layout: AnyUiContainerLayout): this {
        this._layout = layout;
        return this;
    }

    /**
     * Добавить в контейнер элементы. Можно передавать билдеры элементов.
     * @param children
     */
    public with(...children: (UiElemDto|UiElemBuilder)[]): this {
        children.forEach(child => {
            if (child instanceof UiElemBuilder) this._children.push(child.get());
            else this._children.push(child);
        });

        return this;
    }

    /**
     * @inheritDoc
     */
    public get(): UiContainerDto {
        const instance = new UiContainerDto();

        instance.children = this._children;
        instance.layout = this._layout;
        instance.anchor = this._anchor;

        return instance;
    }

    /**
     * @inheritDoc
     */
    public show(): UiContainerDto {
        const dto = this.get();
        UiState.push(dto);

        return dto;
    }
}