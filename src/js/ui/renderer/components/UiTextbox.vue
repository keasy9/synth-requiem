<template>
    <div class="ui-textbox" v-html="entity.content" ref="root"/>
</template>

<script setup lang="ts">
    import type {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
    import {useTemplateRef} from 'vue';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';

    const props = defineProps<{ entity: UiTextboxDto }>();
    const root = useTemplateRef<HTMLDivElement>('root');

    setElem(root, props.entity);
</script>

<style lang="less">
    .ui-textbox {
        color: var(--c-white);
    }
</style>
