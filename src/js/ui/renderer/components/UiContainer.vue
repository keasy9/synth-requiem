<template>
    <div
        class="ui-container"
        :class="{
            [`ui-container--${entity.layout}`]: entity.layout,
            'ui-container--gap': entity.gap,
        }"
        ref="root"
    >
        <component
            class="ui-container__elem"
            v-for="elem in entity.children"
            :key="elem.id"
            :class="{ [getComponentClass(elem)]: true }"
            :is="matchComponent(elem)"
            :entity="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {computed, type Reactive, useTemplateRef} from 'vue';
    import {matchComponent} from '@/ui/renderer/utils/matchComponent.ts';
    import type {DomElement} from '@/ui/entities/abstract/DomElement.ts';
    import {DomBarElement} from '@/ui/entities/DomBarElement.ts';
    import {DomButtonElement} from '@/ui/entities/DomButtonElement.ts';
    import {DomContainerElement} from '@/ui/entities/DomContainerElement.ts';
    import {DomTextboxElement} from '@/ui/entities/DomTextboxElement.ts';
    import {DomSpriteElement} from '@/ui/entities/DomSpriteElement.ts';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';

    const props = defineProps<{ entity: DomContainerElement }>();
    const root = useTemplateRef<HTMLDivElement>('root');

    function getComponentClass(elem: DomElement|Reactive<DomElement>): string {
        if (elem instanceof DomBarElement) return 'ui-container__elem--bar';
        else if (elem instanceof DomButtonElement) return 'ui-container__elem--button';
        else if (elem instanceof DomContainerElement) return 'ui-container__elem--container';
        else if (elem instanceof DomTextboxElement) return 'ui-container__elem--textbox';
        else if (elem instanceof DomSpriteElement) return 'ui-container__elem--sprite';

        return '';
    }

    setElem(root, props.entity);
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
