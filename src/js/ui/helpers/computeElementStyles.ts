import type {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import {type Reactive} from 'vue';
import {UiContainerDto, UiContainerLayout} from '@/ui/dto/UiContainerDto.ts';
import {Config} from '@/config.ts';

export function computeElementStyles(elem: UiElemDto|Reactive<UiElemDto>): Record<string, string> {
    const styles: Record<string, string> = {};

    if (elem instanceof UiContainerDto) {
        switch (elem.layout) {
            case UiContainerLayout.Rows:
                styles['grid-auto-rows'] = elem.children.map(el => el.growing ? '1fr' : 'auto').join(' ');
                break;
            case UiContainerLayout.Cols:
                styles['grid-auto-columns'] = elem.children.map(el => el.growing ? '1fr' : 'auto').join(' ');
                break;
        }

        styles['gap'] = elem.gap * Config.baseScale + 'px';
    }

    styles['padding'] = elem.padding.map(p => p * Config.baseScale + 'px').join(' ');
    styles['margin'] = elem.margin.map(p => p * Config.baseScale + 'px').join(' ');


    return styles;
}