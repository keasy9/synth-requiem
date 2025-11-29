<template>
    <button
        class="ui-button"
        v-html="dto.content"
        @click="onClick"
    />
</template>

<script setup lang="ts">
    import type {UiButtonDto} from '@/helpers/ui/button/UiButtonDto.ts';

    const props = defineProps<{ dto: UiButtonDto }>();

    function onClick() {
        if (props.dto.onclick)  props.dto.onclick();
    }
</script>

<style lnag="less">
    .ui-button {
        border: var(--1-pix) solid var(--c-white);
        padding: var(--1-pix);
        background: none;
        color: var(--c-white);
    }
</style>
