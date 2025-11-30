<template>
    <div
        class="ui-container"
        :class="{
            [`ui-container--${dto.layout}`]: dto.layout,
            'ui-container--gap': dto.gap,
        }"
    >
        <component
            class="ui-container__elem"
            v-for="elem in dto.children"
            :key="elem.id"
            :class="{ [getComponentClass(elem)]: true }"
            :is="getComponentType(elem)"
            :dto="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {UiContainerDto} from '@/ui/builder/container/UiContainerDto.ts';
    import {type Component, computed} from 'vue';
    import type {UiElemDto} from '@/ui/builder/UiElemDto.ts';
    import {UiBarDto} from '@/ui/builder/bar/UiBarDto.ts';
    import UiBar from '@/ui/elements/UiBar.vue';
    import {UiButtonDto} from '@/ui/builder/button/UiButtonDto.ts';
    import UiButton from '@/ui/elements/UiButton.vue';
    import {UiTextboxDto} from '@/ui/builder/textbox/UiTextboxDto.ts';
    import UiTextbox from '@/ui/elements/UiTextbox.vue';
    import UiContainer from '@/ui/elements/UiContainer.vue';
    import {UiSpriteDto} from '@/ui/builder/sprite/UiSpriteDto.ts';
    import UiSprite from '@/ui/elements/UiSprite.vue';
    import {Config} from '@/config.ts';

    const props = defineProps<{ dto: UiContainerDto }>();

    const gap = computed(() => props.dto.gap * Config.pixelRatio + 'px');

    function getComponentType(elem: UiElemDto): Component|undefined {
        if (elem instanceof UiBarDto) return UiBar;
        else if (elem instanceof UiButtonDto) return UiButton;
        else if (elem instanceof UiContainerDto) return UiContainer;
        else if (elem instanceof UiTextboxDto) return UiTextbox;
        else if (elem instanceof UiSpriteDto) return UiSprite;

        return undefined
    }

    function getComponentClass(elem: UiElemDto): string {
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
        &--cols {
            display: flex;

            .ui-container {
                &__elem {
                    flex-grow: 1;

                    &--container,
                    &--sprite {
                        flex-grow: 0;
                    }
                }
            }

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
            display: flex;
            flex-direction: column;

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

<style scoped lang="less">
    .ui-container {
        gap: v-bind(gap);
    }
</style>
