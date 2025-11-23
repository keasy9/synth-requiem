import {UiButtonBuilder} from '@/helpers/ui/button/UiButtonBuilder.ts';
import {UiTextboxBuilder} from '@/helpers/ui/textbox/UiTextboxBuilder.ts';
import {UiBarBuilder} from '@/helpers/ui/bar/UiBarBuilder.ts';
import type {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import {UiContainerBuilder} from '@/helpers/ui/container/UiContainerBuilder.ts';
import {UiElemBuilder} from '@/helpers/ui/UiElemBuilder.ts';
import type {Animation} from 'excalibur';
import {UiSpriteBuilder} from '@/helpers/ui/sprite/UiSpriteBuilder.ts';

export function ui() {
    return {
        button: () => new UiButtonBuilder(),
        text: (html: string = '') => new UiTextboxBuilder().content(html),
        bar: () => new UiBarBuilder(),
        box: (...children: (UiElemDto | UiElemBuilder)[]) => new UiContainerBuilder().with(...children),
        sprite: (source?: Animation) => source ? new UiSpriteBuilder().from(source) : new UiSpriteBuilder(),
    };
}
