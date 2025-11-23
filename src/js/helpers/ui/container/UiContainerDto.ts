import {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import type {EnumValue} from '@/utils/types.ts';

export const UiContainerLayout = {
    Rows: 'rows',
    Cols: 'cols',
    AutoGrid: 'auto-grid',
} as const;

export type AnyUiContainerLayout = EnumValue<typeof UiContainerLayout>

export class UiContainerDto extends UiElemDto {
    public children: UiElemDto[] = [];
    public layout: AnyUiContainerLayout = UiContainerLayout.Rows;
}