import type {AnyUiAnchor} from '@/helpers/ui/UiElemBuilder.ts';
import {UiAnchor} from '@/helpers/ui/UiElemBuilder.ts';
import {UiState} from '@/helpers/ui/State.ts';

export abstract class UiElemDto {
    public anchor: AnyUiAnchor = UiAnchor.Center;
    protected _id: string;

    public constructor() {
        this._id = crypto.randomUUID();
    }

    /**
     * Идентификатор элемента.
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Вывести элемент на экран.
     */
    public show(): void {
        UiState[this._id] = this;
    }

    /**
     * Скрыть элемент.
     */
    public hide(): void {
        delete UiState[this._id];
    }
}