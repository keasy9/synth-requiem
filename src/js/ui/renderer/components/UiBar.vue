<template>
    <div class="ui-bar" ref="root">
        <span class="ui-bar__thumb"/>
    </div>
</template>

<script setup lang="ts">
    import {computed, useTemplateRef} from 'vue';
    import type {DomBarElement} from '@/ui/entities/DomBarElement.ts';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';

    const props = defineProps<{ entity: DomBarElement }>();
    const root = useTemplateRef<HTMLDivElement>('root');
    const height = computed<number>(() => props.entity.height);
    const thumbWidth = computed<string>(() => props.entity.progress + '%');

    setElem(root, props.entity);
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

