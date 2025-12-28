import type {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import {type Animation, Color, type Sprite} from 'excalibur';
import {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
import {UiContainerDto} from '@/ui/dto/UiContainerDto.ts';
import {UiSpriteDto} from '@/ui/dto/UiSpriteDto.ts';
import {UiButtonDto} from '@/ui/dto/UiButtonDto.ts';
import {UiBarDto} from '@/ui/dto/UiBarDto.ts';

export function ui() {
    return {
        button: () => new UiButtonDto(),
        text: (html: string = '') => new UiTextboxDto().html(html),
        bar: () => new UiBarDto(),
        box: (...children: UiElemDto[]) => new UiContainerDto().with(...children),
        sprite: (source?: Animation|Sprite) => UiSpriteDto.make(source),
    };
}


export const UiColor = {
    Primary: Color.fromHex('#4a00e0'),
    Danger: Color.fromHex('#fd2e6d'),
    Accent: Color.fromHex('#00d4ff'),
} as const;
