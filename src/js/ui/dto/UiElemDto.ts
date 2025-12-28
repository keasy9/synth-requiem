import {getElemId, UiState} from '@/ui/State.ts';
import {reactive, type Reactive} from 'vue';
import type {EnumValue} from '@/utils/types.ts';

export const UiAnchor = {
    Center: 'center', // по центру экрана
    Bottom: 'bottom', // на всю ширину, внизу экрана
} as const;

export type AnyUiAnchor = EnumValue<typeof UiAnchor>;

export abstract class UiElemDto {
    public anchor: AnyUiAnchor = UiAnchor.Center;
    protected _id: number;

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
     * Получить реактивную ссылку на элемент.
     */
    public reactive(): Reactive<this> {
        return reactive(this);
    }
}