import {getElemId, UiState} from '@/ui/State.ts';
import {reactive, type Reactive} from 'vue';
import type {EnumValue} from '@/utils/types.ts';
import {Color} from 'excalibur';

export const UiAnchor = {
    Center: 'center', // по центру экрана
    Bottom: 'bottom', // на всю ширину, внизу экрана
} as const;

export type AnyUiAnchor = EnumValue<typeof UiAnchor>;

export abstract class UiElemDto {
    protected _id: number;

    public anchor: AnyUiAnchor = UiAnchor.Center;
    public growing: boolean = false;
    public padding: [number, number, number, number] = [0, 0, 0, 0];
    public margin: [number, number, number, number] = [0, 0, 0, 0];
    public borderWidth: [number, number, number, number] = [0, 0, 0, 0];
    public borderColor?: Color;
    public visible?: boolean = true;

    public constructor() {
        this._id = getElemId();
    }

    /**
     * Уникальный идентификатор элемента.
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Вывести элемент на экран, добавив его в корневой контейнер.
     */
    public addToRoot(): this {
        UiState[this._id] = this.reactive();
        return this;
    }

    /**
     * Удалить элемент с экрана, если он находится в корневом контейнере.
     */
    public removeFromRoot(): this {
        delete UiState[this._id];
        return this;
    }

    /**
     * Установить позицию вывода элемента.
     * @param anchor
     */
    public at(anchor: AnyUiAnchor): this {
        this.anchor = anchor;
        return this;
    }

    /**
     * Растянуть элемент, если он находится в контейнере
     * @param growing
     */
    public grow(growing: boolean = true): this {
        this.growing = growing;
        return this;
    }

    /**
     * Установить внутренние отступы элемента.
     * @param padding
     */
    public withPadding(...padding: [number]): this;
    public withPadding(...padding: [number, number]): this;
    public withPadding(...padding: [number, number, number, number]): this;
    public withPadding(...padding: number[]): this {
        padding[1] ??= padding[0]!;
        padding[2] ??= padding[0]!;
        padding[3] ??= padding[1];

        this.padding = padding as [number, number, number, number];
        return this;
    }

    /**
     * Установить внешние отступы элемента.
     * @param margin
     */
    public withMargin(...margin: [number]): this;
    public withMargin(...margin: [number, number]): this;
    public withMargin(...margin: [number, number, number, number]): this;
    public withMargin(...margin: number[]): this {
        margin[1] ??= margin[0]!;
        margin[2] ??= margin[0]!;
        margin[3] ??= margin[1];

        this.margin = margin as [number, number, number, number];
        return this;
    }

    /**
     * Установить рамки элемента.
     * @param border
     * @param color
     */
    public border(border: number, color?: Color): this;
    public border(borderY: number, borderX: number, color?: Color): this;
    public border(borderTop: number, borderRight: number, borderBottom: number, borderLeft: number, color?: Color): this;
    public border(borderTop: number, borderRight?: number|Color, borderBottom?: number|Color, borderLeft?: number, color?: Color): this {
        if (borderRight instanceof Color) {
            color = borderRight;
            borderRight = undefined;

        } else if (borderBottom instanceof Color) {
            color = borderBottom;
            borderBottom = undefined;
        }

        if (color) this.borderColor = color;

        // noinspection JSSuspiciousNameCombination
        borderRight ??= borderTop;

        this.borderWidth = [
            borderTop,
            borderRight,
            (borderBottom as number) ?? borderTop,
            borderLeft ?? borderRight,
        ];

        return this;
    }


    /**
     * Получить реактивную ссылку на элемент.
     */
    public reactive(): Reactive<this> {
        return reactive(this);
    }

    /**
     * Временно скрыть элемент. Для скрытия на постоянной основе рекомендуется убрать элемент из родительского контейнера.
     */
    public hide(): this {
        this.visible = false;
        return this;
    }

    /**
     * Показать элемент.
     */
    public show(): this {
        this.visible = true;
        return this;
    }
}