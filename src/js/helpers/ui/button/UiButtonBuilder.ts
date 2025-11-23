import {UiElemBuilder} from '@/helpers/ui/UiElemBuilder.ts';
import {UiState} from '@/helpers/ui/State.ts';
import {UiButtonDto} from '@/helpers/ui/button/UiButtonDto.ts';

export class UiButtonBuilder extends UiElemBuilder {
    /**
     * @inheritDoc
     */
    public get(): UiButtonDto {
        const instance = new UiButtonDto();

        instance.anchor = this._anchor;

        return instance;
    }

    /**
     * @inheritDoc
     */
    public show(): UiButtonDto {
        const dto = this.get();
        UiState.push(dto);

        return dto;
    }
}