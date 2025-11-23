<template>
    <div
        class="ui-container"
        :class="{ [`ui-container--${dto.layout}`]: dto.layout }"
    >
        <component
            class="ui-container__elem"
            v-for="(elem, index) in dto.children"
            :key="index"
            :class="{ [getComponentClass(elem)]: true }"
            :is="getComponentType(elem)"
            :dto="elem"
        />
    </div>
</template>

<script setup lang="ts">
    import {UiContainerDto} from '@/helpers/ui/container/UiContainerDto.ts';
    import type {Component} from 'vue';
    import type {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
    import {UiBarDto} from '@/helpers/ui/bar/UiBarDto.ts';
    import UiBar from '@/components/ui/UiBar.vue';
    import {UiButtonDto} from '@/helpers/ui/button/UiButtonDto.ts';
    import UiButton from '@/components/ui/UiButton.vue';
    import {UiTextboxDto} from '@/helpers/ui/textbox/UiTextboxDto.ts';
    import UiTextbox from '@/components/ui/UiTextbox.vue';
    import UiContainer from '@/components/ui/UiContainer.vue';

    const props = defineProps<{ dto: UiContainerDto }>();

    function getComponentType(elem: UiElemDto): Component|undefined {
        if (elem instanceof UiBarDto) return UiBar;
        else if (elem instanceof UiButtonDto) return UiButton;
        else if (elem instanceof UiContainerDto) return UiContainer;
        else if (elem instanceof UiTextboxDto) return UiTextbox;

        return undefined
    }

    function getComponentClass(elem: UiElemDto): string {
        if (elem instanceof UiBarDto) return 'ui-container__elem--bar';
        else if (elem instanceof UiButtonDto) return 'ui-container__elem--button';
        else if (elem instanceof UiContainerDto) return 'ui-container__elem--container';
        else if (elem instanceof UiTextboxDto) return 'ui-container__elem--textbox';

        return '';
    }
</script>
