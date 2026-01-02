import UiBar from '@/ui/renderer/components/UiBar.vue';
import UiButton from '@/ui/renderer/components/UiButton.vue';
import UiContainer from '@/ui/renderer/components/UiContainer.vue';
import UiTextbox from '@/ui/renderer/components/UiTextbox.vue';
import UiSprite from '@/ui/renderer/components/UiSprite.vue';
import type {Component, Reactive} from 'vue';
import {DomBarElement} from '@/ui/entities/DomBarElement.ts';
import {DomButtonElement} from '@/ui/entities/DomButtonElement.ts';
import {DomContainerElement} from '@/ui/entities/DomContainerElement.ts';
import {DomTextboxElement} from '@/ui/entities/DomTextboxElement.ts';
import {DomSpriteElement} from '@/ui/entities/DomSpriteElement.ts';
import type {DomElement} from '@/ui/entities/abstract/DomElement.ts';

export function matchComponent(elem: DomElement|Reactive<DomElement>): Component|undefined {
    if (elem instanceof DomBarElement) return UiBar;
    else if (elem instanceof DomButtonElement) return UiButton;
    else if (elem instanceof DomContainerElement) return UiContainer;
    else if (elem instanceof DomTextboxElement) return UiTextbox;
    else if (elem instanceof DomSpriteElement) return UiSprite;

    return undefined
}