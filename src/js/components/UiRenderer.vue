<template>
    <div class="ui">
        <component
            class="ui__elem"
            v-for="(elem, index) in UiState"
            :key="index"
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
    import {UiState} from '@/helpers/ui/State.ts';
    import type {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
    import {UiBarDto} from '@/helpers/ui/bar/UiBarDto.ts';
    import UiBar from '@/components/ui/UiBar.vue';
    import {UiButtonDto} from '@/helpers/ui/button/UiButtonDto.ts';
    import {UiContainerDto} from '@/helpers/ui/container/UiContainerDto.ts';
    import UiContainer from '@/components/ui/UiContainer.vue';
    import UiButton from '@/components/ui/UiButton.vue';
    import {UiTextboxDto} from '@/helpers/ui/textbox/UiTextboxDto.ts';
    import UiTextbox from '@/components/ui/UiTextbox.vue';
    import {type Component, ref} from 'vue';
    import {Config} from '@/config.ts';

    function getComponentType(elem: UiElemDto): Component|undefined {
        if (elem instanceof UiBarDto) return UiBar;
        else if (elem instanceof UiButtonDto) return UiButton;
        else if (elem instanceof UiContainerDto) return UiContainer;
        else if (elem instanceof UiTextboxDto) return UiTextbox;

        return undefined
    }

    function getComponentClass(elem: UiElemDto): string {
        if (elem instanceof UiBarDto) return 'ui__elem--bar';
        else if (elem instanceof UiButtonDto) return 'ui__elem--button';
        else if (elem instanceof UiContainerDto) return 'ui__elem--container';
        else if (elem instanceof UiTextboxDto) return 'ui__elem--textbox';

        return '';
    }

    const pixelRatio = ref(Config.pixelRatio);
</script>

<style lang="less">
    .ui {
        --pixel-ratio: v-bind(pixelRatio);
        --1-pix: calc(var(--pixel-ratio) * 1px);

        --c-white: white;
        --c-black-faded: rgba(0, 0, 0, .7);

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
        z-index: 100;

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
