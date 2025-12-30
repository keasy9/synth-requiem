<template>
    <div
        class="ui-container"
        :class="{
            [`ui-container--${dto.layout}`]: dto.layout,
            'ui-container--gap': dto.gap,
        }"
        :style="elStyle"
    >
        <component
            class="ui-container__elem"
            v-for="elem in dto.children"
            :key="elem.id"
            :class="{ [getComponentClass(elem)]: true }"
            :style="computeElementStyles(elem)"
            :is="matchDtoComponent(elem)"
            :dto="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {UiContainerDto, UiContainerLayout} from '@/ui/dto/UiContainerDto.ts';
    import {computed, type Reactive} from 'vue';
    import type {UiElemDto} from '@/ui/dto/UiElemDto.ts';
    import {UiBarDto} from '@/ui/dto/UiBarDto.ts';
    import {UiButtonDto} from '@/ui/dto/UiButtonDto.ts';
    import {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
    import {UiSpriteDto} from '@/ui/dto/UiSpriteDto.ts';
    import {matchDtoComponent} from '@/ui/utils/matchDtoComponent.ts';
    import {computeElementStyles} from '@/ui/utils/computeElementStyles.ts';

    const props = defineProps<{ dto: UiContainerDto }>();

    const elStyle = computed(() => {
        switch (props.dto.layout) {
            case UiContainerLayout.Rows:
                return { 'grid-auto-rows': props.dto.children.map(el => el.growing ? '1fr' : 'auto').join(' ') };
            case UiContainerLayout.Cols:
                return { 'grid-auto-columns': props.dto.children.map(el => el.growing ? '1fr' : 'auto').join(' ') };
        }
    });

    function getComponentClass(elem: UiElemDto|Reactive<UiElemDto>): string {
        if (elem instanceof UiBarDto) return 'ui-container__elem--bar';
        else if (elem instanceof UiButtonDto) return 'ui-container__elem--button';
        else if (elem instanceof UiContainerDto) return 'ui-container__elem--container';
        else if (elem instanceof UiTextboxDto) return 'ui-container__elem--textbox';
        else if (elem instanceof UiSpriteDto) return 'ui-container__elem--sprite';

        return '';
    }
</script>

<style lang="less">
    .ui-container {
        display: grid;

        &--cols {
            grid-auto-flow: column;


            &:not(.ui-container--gap) {
                & > .ui-container__elem {
                    &:not(:last-child) {
                        border-right: none;
                    }

                    &--container > .ui-container__elem {
                        border-right: none;
                    }
                }
            }
        }

        &--rows {
            grid-auto-flow: row;

            .ui-container:not(.ui-container--gap) {
                .ui-container {
                    &__elem {
                        &:not(:last-child) {
                            border-bottom: none;
                        }
                    }
                }
            }
        }
    }
</style>
