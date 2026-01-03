<template>
    <div class="ui" ref="root">
        <component
            class="ui__elem"
            v-for="elem in UiDtoState"
            :key="elem.id"
            :class="{
                [`ui__elem--${elem.anchor}`]: elem.anchor,
                [getComponentClass(elem)]: true,
            }"
            :is="matchComponent(elem)"
            :dto="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {UiDtoState} from '@/ui/State.ts';
    import {nextTick, type Reactive, ref, useTemplateRef, watch} from 'vue';
    import {Config} from '@/config.ts';
    import {matchComponent} from '@/ui/renderer/utils/matchComponent.ts';
    import type {DomElementDto} from '@/ui/entities/abstract/DomElement.ts';
    import {DomElementType} from '@/ui/components/DomComponent.ts';

    const root = useTemplateRef('root');

    function getComponentClass(elem: Reactive<DomElementDto>): string {
        switch (elem.type) {
            case DomElementType.Bar:
                return 'ui__elem--bar';
            case DomElementType.Button:
                return 'ui__elem--button';
            case DomElementType.Container:
                return 'ui__elem--container';
            case DomElementType.Sprite:
                return 'ui__elem--sprite';
            case DomElementType.Textbox:
                return 'ui__elem--textbox';
        }

        return '';
    }

    const pixelRatio = ref(Config.baseScale);

    watch(UiDtoState, () => {
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

        font-family: "small", Arial, serif;
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
