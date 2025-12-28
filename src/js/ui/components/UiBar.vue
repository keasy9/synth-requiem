<template>
    <div class="ui-bar">
        <span class="ui-bar__thumb"/>
    </div>
</template>

<script setup lang="ts">
    import type {UiBarDto} from '@/ui/dto/UiBarDto.ts';
    import {computed} from 'vue';
    import {Color} from 'excalibur';

    const props = defineProps<{ dto: UiBarDto }>();
    const height = computed<number>(() => props.dto.height);
    const thumbWidth = computed<string>(() => props.dto.progress + '%');

    const backgroundColor = computed<string>(() => {
        // todo смена цвета градиентом
        const keys = Object.keys(props.dto.colors).sort();

        let currentColor: Color|undefined;
        for (const key of keys) {
            const numericKey = Number(key)
            if (numericKey >= props.dto.progress) {
                currentColor = props.dto.colors[numericKey];
                break;
            }
        }

        return currentColor?.toHex() ?? '';
    });
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
            background: v-bind(backgroundColor);
        }
    }
</style>

