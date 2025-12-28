import {getElemId, UiState} from '@/ui/State.ts';
import {reactive, type Reactive} from 'vue';
import type {EnumValue} from '@/utils/types.ts';

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
     * Вывести элемент на экран.
     */
    public show(): this {
        UiState[this._id] = this.reactive();
        return this;
    }

    /**
     * Скрыть элемент.
     */
    public hide(): this {
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
     * Установить внутренние отступы контейнера.
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
     * Установить внутренние отступы контейнера.
     * @param padding
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
     * Получить реактивную ссылку на элемент.
     */
    public reactive(): Reactive<this> {
        return reactive(this);
    }
}