import {UiElemDto} from '@/ui/builder/UiElemDto.ts';

export class UiTextboxDto extends UiElemDto {
    public content: string = '';
    public typing: boolean = false;
}