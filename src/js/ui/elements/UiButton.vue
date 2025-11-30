<template>
    <button
        class="ui-button"
        v-html="dto.content"
        @click="onClick"
        @mouseenter="$el.focus()"
    />
</template>

<script setup lang="ts">
    import type {UiButtonDto} from '@/ui/builder/button/UiButtonDto.ts';

    const props = defineProps<{ dto: UiButtonDto }>();

    function onClick() {
        if (props.dto.onclick)  props.dto.onclick();
    }
</script>

<style lnag="less">
    .ui-button {
        border: var(--border-default);
        border-radius: var(--border-radius);
        padding: var(--1-pix);
        background: none;
        color: var(--c-white);

        &:not(:focus),
        &:active {
            border-color: var(--c-gray);
        }
    }
</style>
