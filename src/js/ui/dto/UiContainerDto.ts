import {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import type {EnumValue} from '@/utils/types.ts';
import {isReactive, type Reactive} from 'vue';

export const UiContainerLayout = {
    Rows: 'rows',
    Cols: 'cols',
    AutoGrid: 'auto-grid',
} as const;

export type AnyUiContainerLayout = EnumValue<typeof UiContainerLayout>

export class UiContainerDto<TChildren extends UiElemDto = UiElemDto> extends UiElemDto {
    public children: Reactive<TChildren>[] = [];
    public layout: AnyUiContainerLayout = UiContainerLayout.Rows;
    public gap: number = 0;

    /**
     * Расположить элементы контейнера строками.
     */
    public asRows(): this {
        this.layout = UiContainerLayout.Rows;
        return this;
    }

    /**
     * Расположить элементы контейнера колонками
     */
    public asCols(): this {
        this.layout = UiContainerLayout.Cols;
        return this;
    }

    /**
     * Расположить элементы контейнера по сетке.
     */
    public asGrid(): this {
        this.layout = UiContainerLayout.AutoGrid;
        return this;
    }

    /**
     * Установить способ расположения элементов контейнера.
     * @param layout
     */
    public as(layout: AnyUiContainerLayout): this {
        this.layout = layout;
        return this;
    }

    /**
     * Установить отступ между элементами контейнера.
     * @param gap
     */
    public withGap(gap: number): this {
        this.gap = gap;
        return this;
    }

    /**
     * Добавить в контейнер элементы. Можно передавать реактивные ссылки на элементы.
     * @param children
     */
    public with(...children: (TChildren|Reactive<TChildren>)[]): this {
        children.forEach(child => {
            if (isReactive(child)) this.children.push(child as Reactive<TChildren>);
            else this.children.push((child as TChildren).reactive());
        });

        return this;
    }
}