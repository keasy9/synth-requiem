<template>
    <div class="ui-textbox" v-html="dto.content"/>
</template>

<script setup lang="ts">
    import type {UiTextboxDto} from '@/helpers/ui/textbox/UiTextboxDto.ts';

    const props = defineProps<{ dto: UiTextboxDto }>();
</script>

<style lang="less">
    .ui-textbox {
        border: var(--1-pix) solid var(--c-white);
        padding: var(--1-pix);
        background: var(--c-black-faded);
        color: var(--c-white);
    }
</style>
