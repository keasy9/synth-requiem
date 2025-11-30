<template>
    <div class="ui" ref="root">
        <component
            class="ui__elem"
            v-for="elem in UiState"
            :key="elem.id"
            :class="{
                [`ui__elem--${elem.anchor}`]: elem.anchor,
                [getComponentClass(elem)]: true
            }"
            :is="getComponentType(elem)"
            :dto="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {UiState} from '@/ui/State.ts';
    import type {UiElemDto} from '@/ui/builder/UiElemDto.ts';
    import {UiBarDto} from '@/ui/builder/bar/UiBarDto.ts';
    import UiBar from '@/ui/elements/UiBar.vue';
    import {UiButtonDto} from '@/ui/builder/button/UiButtonDto.ts';
    import {UiContainerDto} from '@/ui/builder/container/UiContainerDto.ts';
    import UiContainer from '@/ui/elements/UiContainer.vue';
    import UiButton from '@/ui/elements/UiButton.vue';
    import {UiTextboxDto} from '@/ui/builder/textbox/UiTextboxDto.ts';
    import UiTextbox from '@/ui/elements/UiTextbox.vue';
    import {type Component, nextTick, ref, useTemplateRef, watch} from 'vue';
    import {Config} from '@/config.ts';
    import UiSprite from '@/ui/elements/UiSprite.vue';
    import {UiSpriteDto} from '@/ui/builder/sprite/UiSpriteDto.ts';

    const root = useTemplateRef('root');

    function getComponentType(elem: UiElemDto): Component|undefined {
        if (elem instanceof UiBarDto) return UiBar;
        else if (elem instanceof UiButtonDto) return UiButton;
        else if (elem instanceof UiContainerDto) return UiContainer;
        else if (elem instanceof UiTextboxDto) return UiTextbox;
        else if (elem instanceof UiSpriteDto) return UiSprite;

        return undefined
    }

    function getComponentClass(elem: UiElemDto): string {
        if (elem instanceof UiBarDto) return 'ui__elem--bar';
        else if (elem instanceof UiButtonDto) return 'ui__elem--button';
        else if (elem instanceof UiContainerDto) return 'ui__elem--container';
        else if (elem instanceof UiTextboxDto) return 'ui__elem--textbox';
        else if (elem instanceof UiSpriteDto) return 'ui__elem--sprite';

        return '';
    }

    const pixelRatio = ref(Config.pixelRatio);

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

        --border-width: calc(var(--1-pix) / 2);
        --border-radius: 0;
        --border-default: var(--border-width) solid var(--c-white);

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
