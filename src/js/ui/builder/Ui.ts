import {UiButtonBuilder} from '@/ui/builder/button/UiButtonBuilder.ts';
import {UiTextboxBuilder} from '@/ui/builder/textbox/UiTextboxBuilder.ts';
import {UiBarBuilder} from '@/ui/builder/bar/UiBarBuilder.ts';
import type {UiElemDto} from '@/ui/builder/UiElemDto.ts';
import {UiContainerBuilder} from '@/ui/builder/container/UiContainerBuilder.ts';
import {UiElemBuilder} from '@/ui/builder/UiElemBuilder.ts';
import type {Animation} from 'excalibur';
import {UiSpriteBuilder} from '@/ui/builder/sprite/UiSpriteBuilder.ts';

export function ui() {
    return {
        button: () => new UiButtonBuilder(),
        text: (html: string = '') => new UiTextboxBuilder().content(html),
        bar: () => new UiBarBuilder(),
        box: (...children: (UiElemDto | UiElemBuilder)[]) => new UiContainerBuilder().with(...children),
        sprite: (source?: Animation) => source ? new UiSpriteBuilder().from(source) : new UiSpriteBuilder(),
    };
}
