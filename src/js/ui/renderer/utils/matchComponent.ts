import UiBar from '@/ui/renderer/components/UiBar.vue';
import UiButton from '@/ui/renderer/components/UiButton.vue';
import UiContainer from '@/ui/renderer/components/UiContainer.vue';
import UiTextbox from '@/ui/renderer/components/UiTextbox.vue';
import UiSprite from '@/ui/renderer/components/UiSprite.vue';
import type {Component, Reactive} from 'vue';
import type {DomElementDto} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';

export function matchComponent(elem: DomElementDto|Reactive<DomElementDto>): Component|undefined {
    switch (elem.type) {
        case DomElementType.Bar:
            return UiBar;
        case DomElementType.Button:
            return UiButton;
        case DomElementType.Container:
            return UiContainer;
        case DomElementType.Sprite:
            return UiSprite;
        case DomElementType.Textbox:
            return UiTextbox;
    }

    return undefined
}