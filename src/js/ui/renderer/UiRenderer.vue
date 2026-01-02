<template>
    <div class="ui" ref="root">
        <component
            class="ui__elem"
            v-for="elem in UiState"
            :key="elem.id"
            :class="{
                [`ui__elem--${elem.element.anchor}`]: elem.element.anchor,
                [getComponentClass(elem)]: true
            }"
            :is="matchComponent(elem)"
            :entity="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {UiState} from '@/ui/State.ts';
    import {nextTick, type Reactive, ref, useTemplateRef, watch} from 'vue';
    import {Config} from '@/config.ts';
    import {matchComponent} from '@/ui/renderer/utils/matchComponent.ts';
    import type {DomElement} from '@/ui/entities/abstract/DomElement.ts';
    import {DomBarElement} from '@/ui/entities/DomBarElement.ts';
    import {DomButtonElement} from '@/ui/entities/DomButtonElement.ts';
    import {DomContainerElement} from '@/ui/entities/DomContainerElement.ts';
    import {DomTextboxElement} from '@/ui/entities/DomTextboxElement.ts';
    import {DomSpriteElement} from '@/ui/entities/DomSpriteElement.ts';

    const root = useTemplateRef('root');

    function getComponentClass(elem: DomElement|Reactive<DomElement>): string {
        if (elem instanceof DomBarElement) return 'ui__elem--bar';
        else if (elem instanceof DomButtonElement) return 'ui__elem--button';
        else if (elem instanceof DomContainerElement) return 'ui__elem--container';
        else if (elem instanceof DomTextboxElement) return 'ui__elem--textbox';
        else if (elem instanceof DomSpriteElement) return 'ui__elem--sprite';

        return '';
    }

    const pixelRatio = ref(Config.baseScale);

    watch(UiState, () => {
        nextTick(() => {
            if (root.value?.querySelector(':focus')) return;
            root.value?.querySelector('button')?.focus();
        });
    }, {immediate: true});
</script>

<style lang="less">
    .ui {
        --pixel-ratio: v-bind(pixelRatio);
        --1-pix: calc(var(--pixel-ratio) * 1px);

        --c-white: #ffffff;
        --c-gray: #818793;
        --c-black-faded: #000000b2;
        --c-primary: #4a00e0;

        --border-width: calc(var(--1-pix) / 2);
        --border-radius: 0;
        --border-default: var(--border-width) solid var(--c-white);

        --trans-time: .3s;
        --trans-ease: ease;

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
        z-index: 100;
        image-rendering: pixelated;

        *:focus {
            outline: none;
        }

        &__elem {
            position: absolute;
            width: fit-content;
            height: fit-content;
            pointer-events: auto;
            box-sizing: border-box;

            &--center {
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }

            &--bottom {
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
            }
        }
    }
</style>
