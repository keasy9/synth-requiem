<template>
    <div class="ui-textbox" v-html="typedText"/>
</template>

<script setup lang="ts">
    import type {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
    import {computed, watch} from 'vue';
    import {useTyping} from '@/ui/helpers/useTyping.ts';

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
        color: var(--c-white);
    }
</style>
