<template>
    <div class="ui-textbox" v-html="dto.content"/>
</template>

<script setup lang="ts">
    import type {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';

    const props = defineProps<{ dto: UiTextboxDto }>();
</script>

<style lang="less">
    .ui-textbox {
        color: var(--c-white);
    }
</style>
