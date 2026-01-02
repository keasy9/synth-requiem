<template>
    <button
        class="ui-button"
        @mouseenter="root?.focus()"
        ref="root"
    >
        <span class="ui-button__content">
            <span
                class="ui-button__html"
                v-html="dto.content"
            />
        </span>
    </button>
</template>

<script setup lang="ts">
    import {computed, useTemplateRef} from 'vue';
    import {Config} from '@/config.ts';
    import type {DomButtonDto} from '@/ui/entities/DomButtonElement.ts';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';

    const props = defineProps<{ dto: DomButtonDto }>();

    const root = useTemplateRef<HTMLButtonElement>('root');
    const padding = computed(() => props.dto.padding?.map(p => p * Config.baseScale + 'px').join(' ') ?? 0);

    setElem(root, props.dto.id);
</script>

<style lang="less">
    .ui-button {
        --b-i-slice: 2;
        --b-i-width: calc(var(--b-i-slice) * var(--1-pix));
        --b-i-offset: 2;

        padding: 0;
        position: relative;
        background: none;
        color: var(--c-white);
        display: flex;
        border: none;
        cursor: pointer;

        &__content {
            position: relative;
            display: flex;
            flex-grow: 1;
            align-items: center;

            &:before,
            &:after {
                position: static;
                display: block;
                content: '';
                border-image: url("/assets/border-9-slice.png") var(--b-i-slice) / var(--b-i-width);
                height: 100%;
                width: calc(var(--b-i-width) * var(--b-i-offset));
                opacity: 1;
            }

            &:before {
                border-image-width: var(--b-i-width) 0 var(--b-i-width) var(--b-i-width);
            }

            &:after {
                border-image-width: var(--b-i-width) var(--b-i-width) var(--b-i-width) 0;
            }
        }

        &__html {
            flex-grow: 1;
            padding: v-bind(padding);
        }

        &:after {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            display: block;
            content: '';
            border-image: url("/assets/border-9-slice.png") var(--b-i-slice) / var(--b-i-width);
            opacity: 0;
            transition: opacity var(--trans-time) var(--trans-ease);

            // --c-accent
            filter:
                brightness(0)
                saturate(100%)
                invert(14%)
                sepia(97%)
                saturate(7391%)
                hue-rotate(265deg)
                brightness(80%)
                contrast(127%);
        }

        &:focus,
        &:active {
            &:after {
                opacity: 1;
            }
        }
    }
</style>
