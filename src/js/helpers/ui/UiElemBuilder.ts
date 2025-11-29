import type {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import type {EnumValue} from '@/utils/types.ts';
import type {Reactive} from 'vue';

export const UiAnchor = {
    Center: 'center', // по центру экрана
    Bottom: 'bottom', // на всю ширину, внизу экрана
} as const;

export type AnyUiAnchor = EnumValue<typeof UiAnchor>;

export abstract class UiElemBuilder {
    protected _anchor: AnyUiAnchor = UiAnchor.Center;

    /**
     * Установить позицию вывода элемента.
     * @param anchor
     */
    public at(anchor: AnyUiAnchor): this {
        this._anchor = anchor;
        return this;
    }

    /**
     * Вывести элемент на экран.
     */
    public abstract show(): Reactive<UiElemDto>;

    /**
     * Получить экземпляр элемента, не выводя его на экран.
     */
    public abstract get(): Reactive<UiElemDto>;
}
