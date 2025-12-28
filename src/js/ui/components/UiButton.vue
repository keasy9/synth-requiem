<template>
    <button
        class="ui-button"
        @click="onClick"
        @mouseenter="$el.focus()"
    >
        <span
            class="ui-button__content"
            v-html="dto.content"
        />
    </button>
</template>

<script setup lang="ts">
    import type {UiButtonDto} from '@/ui/dto/UiButtonDto.ts';

    const props = defineProps<{ dto: UiButtonDto }>();

    function onClick() {
        if (props.dto.onclick)  props.dto.onclick();
    }
</script>

<style lang="less">
    .ui-button {
        --b-i-slice: 2;
        --b-i-width: calc(var(--b-i-slice) * var(--1-pix));
        --b-i-offset: 2;

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
            justify-content: space-between;

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

        &:after {
            position: absolute;
            top: var(--1-pix);
            bottom: var(--1-pix);
            right: var(--1-pix);
            left: var(--1-pix);
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
