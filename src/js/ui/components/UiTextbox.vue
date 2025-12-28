<template>
    <div class="ui-textbox" v-html="typedText"/>
</template>

<script setup lang="ts">
    import type {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
    import {computed, watch} from 'vue';
    import {useTyping} from '@/ui/helpers/use-typing.ts';

    const props = defineProps<{ dto: UiTextboxDto }>();

    const {
        start,
        end,
        typedText,
    } = useTyping(computed(() => props.dto.content));

    watch(() => props.dto.content, () => {
        if (props.dto.typing) start();
        else end();
    }, {immediate: true});
</script>

<style lang="less">
    .ui-textbox {
        border: var(--border-default);
        border-radius: var(--border-radius);
        padding: var(--1-pix);
        background: var(--c-black-faded);
        color: var(--c-white);
    }
</style>
