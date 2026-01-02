<template>
    <button
        class="ui-button"
        @click="props.entity.element.emit(DomEvents.Click)"
        @focus="props.entity.element.emit(DomEvents.Focus)"
        @mouseenter="onMouseEnter"
        ref="root"
    >
        <span class="ui-button__content">
            <span
                class="ui-button__html"
                v-html="entity.content"
            />
        </span>
    </button>
</template>

<script setup lang="ts">
    import {computed, useTemplateRef, watch} from 'vue';
    import {Config} from '@/config.ts';
    import {EventBus, Events} from '@/helpers/events/EventBus.ts';
    import type {DomButtonElement} from '@/ui/entities/DomButtonElement.ts';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';
    import {DomEvents} from '@/ui/components/DomComponent.ts';

    const props = defineProps<{ entity: DomButtonElement }>();

    const root = useTemplateRef<HTMLButtonElement>('root');
    const padding = computed(() => props.entity.padding.map(p => p * Config.baseScale + 'px').join(' '));

    function onMouseEnter() {
        EventBus.emit(Events.UIButtonUnfocus);
        root.value?.focus();
        props.entity.element.emit(DomEvents.Focus);
    }

    watch(() => props.entity.focused, () => {
        if (props.entity.focused && !(document.hasFocus() && document.activeElement === root.value)) {
            root.value?.focus();
        }
        else if (!props.entity.focused && document.hasFocus() && document.activeElement === root.value) root.value?.blur();
    }, {immediate: true});

    setElem(root, props.entity);
</script>

<style lang="less">
    .ui-button {
        --b-i-slice: 2;
        --b-i-width: calc(var(--b-i-slice) * var(--1-pix));
        --b-i-offset: 2;

        padding: 0;
        position: relative;
        background: none;
        color: var(--c-white);
        display: flex;
        border: none;
        cursor: pointer;

        &__content {
            position: relative;
            display: flex;
            flex-grow: 1;
            align-items: center;

            &:before,
            &:after {
                position: static;
                display: block;
                content: '';
                border-image: url("/assets/border-9-slice.png") var(--b-i-slice) / var(--b-i-width);
                height: 100%;
                width: calc(var(--b-i-width) * var(--b-i-offset));
                opacity: 1;
            }

            &:before {
                border-image-width: var(--b-i-width) 0 var(--b-i-width) var(--b-i-width);
            }

            &:after {
                border-image-width: var(--b-i-width) var(--b-i-width) var(--b-i-width) 0;
            }
        }

        &__html {
            flex-grow: 1;
            padding: v-bind(padding);
        }

        &:after {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            display: block;
            content: '';
            border-image: url("/assets/border-9-slice.png") var(--b-i-slice) / var(--b-i-width);
            opacity: 0;
            transition: opacity var(--trans-time) var(--trans-ease);

            // --c-accent
            filter:
                brightness(0)
                saturate(100%)
                invert(14%)
                sepia(97%)
                saturate(7391%)
                hue-rotate(265deg)
                brightness(80%)
                contrast(127%);
        }

        &:focus,
        &:active {
            &:after {
                opacity: 1;
            }
        }
    }
</style>
