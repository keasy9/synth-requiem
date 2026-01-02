<template>
    <div
        class="ui-container"
        :class="{ [`ui-container--${dto.layout}`]: dto.layout }"
        ref="root"
    >
        <component
            class="ui-container__elem"
            v-for="elem in dto.children"
            :key="elem.id"
            :class="{ [getComponentClass(elem)]: true }"
            :is="matchComponent(elem)"
            :dto="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {type Reactive, useTemplateRef} from 'vue';
    import {matchComponent} from '@/ui/renderer/utils/matchComponent.ts';
    import type {DomElementDto} from '@/ui/entities/abstract/DomElement.ts';
    import {type DomContainerDto} from '@/ui/entities/DomContainerElement.ts';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';
    import {DomElementType} from '@/ui/components/DomComponent.ts';

    const props = defineProps<{ dto: DomContainerDto }>();
    const root = useTemplateRef<HTMLDivElement>('root');

    function getComponentClass(elem: Reactive<DomElementDto>): string {
        switch (elem.type) {
            case DomElementType.Bar:
                return 'ui-container__elem--bar';
            case DomElementType.Button:
                return 'ui-container__elem--button';
            case DomElementType.Container:
                return 'ui-container__elem--container';
            case DomElementType.Sprite:
                return 'ui-container__elem--sprite';
            case DomElementType.Textbox:
                return 'ui-container__elem--textbox';
        }

        return '';
    }

    setElem(root, props.dto.id);
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
