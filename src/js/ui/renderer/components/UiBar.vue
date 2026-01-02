<template>
    <div class="ui-bar" ref="root">
        <span class="ui-bar__thumb"/>
    </div>
</template>

<script setup lang="ts">
    import {computed, useTemplateRef} from 'vue';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';
    import type {DomBarDto} from '@/ui/entities/DomBarElement.ts';

    const props = defineProps<{ dto: DomBarDto }>();
    const root = useTemplateRef<HTMLDivElement>('root');
    const height = computed<number>(() => props.dto.height ?? 2);
    const thumbWidth = computed<string>(() => props.dto.progress + '%');

    setElem(root, props.dto.id);
</script>

<style lang="less">
    .ui-bar {
        display: flex;
        align-items: stretch;
        justify-content: start;
    }
</style>

<style scoped lang="less">
    .ui-bar {
        height: calc(v-bind(height) * var(--1-pix));

        &__thumb {
            width: v-bind(thumbWidth);
        }
    }
</style>

