import {UiElemDto} from '@/ui/builder/UiElemDto.ts';

export class UiButtonDto extends UiElemDto {
    public content: string = '';
    public onclick?: Function;
}