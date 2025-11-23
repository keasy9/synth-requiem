import {UiElemBuilder} from '@/helpers/ui/UiElemBuilder.ts';
import {UiState} from '@/helpers/ui/State.ts';
import {UiBarDto} from '@/helpers/ui/bar/UiBarDto.ts';

export class UiBarBuilder extends UiElemBuilder {
    /**
     * @inheritDoc
     */
    public get(): UiBarDto {
        const instance = new UiBarDto();

        instance.anchor = this._anchor;

        return instance;
    }

    /**
     * @inheritDoc
     */
    public show(): UiBarDto {
        const dto = this.get();
        UiState.push(dto);

        return dto;
    }
}