import type {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import {type Reactive} from 'vue';
import {UiContainerDto, UiContainerLayout} from '@/ui/dto/UiContainerDto.ts';
import {Config} from '@/config.ts';
import {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';

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

    } else if (elem instanceof UiTextboxDto) {
        if (!elem.growing) styles['width'] = 'fit-content';

        styles['border-width'] = elem.borderWidth.map(p => p * Config.baseScale + 'px').join(' ');
        styles['border-color'] = elem.borderColor?.toHex() ?? 'transparent';
        styles['border-style'] = 'solid';
    }

    styles['padding'] = elem.padding.map(p => p * Config.baseScale + 'px').join(' ');
    styles['margin'] = elem.margin.map(p => p * Config.baseScale + 'px').join(' ');

    return styles;
}