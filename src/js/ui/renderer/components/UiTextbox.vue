<template>
    {{ id }}
    <div class="ui-textbox" v-html="dto.content" ref="root"/>
</template>

<script setup lang="ts">
    import {useTemplateRef} from 'vue';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';
    import type {DomTextboxDto} from '@/ui/entities/DomTextboxElement.ts';

    const props = defineProps<{ dto: DomTextboxDto }>();
    const root = useTemplateRef<HTMLDivElement>('root');

    setElem(root, props.dto.id);
</script>

<style lang="less">
    .ui-textbox {
        color: var(--c-white);
    }
</style>
