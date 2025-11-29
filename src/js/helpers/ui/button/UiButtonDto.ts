import {UiElemDto} from '@/helpers/ui/UiElemDto.ts';

export class UiButtonDto extends UiElemDto {
    public content: string = '';
    public onclick?: Function;
}