import type {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import {UiBarDto} from '@/ui/dto/UiBarDto.ts';
import {UiButtonDto} from '@/ui/dto/UiButtonDto.ts';
import {UiContainerDto} from '@/ui/dto/UiContainerDto.ts';
import {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
import {UiSpriteDto} from '@/ui/dto/UiSpriteDto.ts';
import UiBar from '@/ui/components/UiBar.vue';
import UiButton from '@/ui/components/UiButton.vue';
import UiContainer from '@/ui/components/UiContainer.vue';
import UiTextbox from '@/ui/components/UiTextbox.vue';
import UiSprite from '@/ui/components/UiSprite.vue';
import type {Component, Reactive} from 'vue';

export function matchDtoComponent(elem: UiElemDto|Reactive<UiElemDto>): Component|undefined {
    if (elem instanceof UiBarDto) return UiBar;
    else if (elem instanceof UiButtonDto) return UiButton;
    else if (elem instanceof UiContainerDto) return UiContainer;
    else if (elem instanceof UiTextboxDto) return UiTextbox;
    else if (elem instanceof UiSpriteDto) return UiSprite;

    return undefined
}