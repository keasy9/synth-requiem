import {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import type {EnumValue} from '@/utils/types.ts';
import type {Reactive} from 'vue';

export const UiContainerLayout = {
    Rows: 'rows',
    Cols: 'cols',
    AutoGrid: 'auto-grid',
} as const;

export type AnyUiContainerLayout = EnumValue<typeof UiContainerLayout>

export class UiContainerDto extends UiElemDto {
    public children: Reactive<UiElemDto>[] = [];
    public layout: AnyUiContainerLayout = UiContainerLayout.Rows;
    public gap: number = 0;
}