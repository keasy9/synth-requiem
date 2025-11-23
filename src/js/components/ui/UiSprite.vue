<template>
    <div class="ui-sprite">
        <img v-if="currentFrame" class="ui-sprite__img" :src="currentFrame.src" alt="">
    </div>
</template>

<script setup lang="ts">
    import type {SpriteFrameDto, UiSpriteDto} from '@/helpers/ui/sprite/UiSpriteDto.ts';
    import {computed, ref, watch} from 'vue';
    import {Config} from '@/config.ts';
    import {AnimationStrategy} from 'excalibur';

    const props = defineProps<{ dto: UiSpriteDto }>();

    const scale = computed(() => Config.pixelRatio * props.dto.scale);
    const width = computed(() => props.dto.width * scale.value + 'px');
    const height = computed(() => props.dto.height * scale.value + 'px');

    const currentFrameIndex = ref<number>(0);
    const currentFrame = computed<SpriteFrameDto|undefined>(() => props.dto.frames[currentFrameIndex.value]);
    const frameRatio = computed(() => (currentFrame.value?.width ?? 0) / (currentFrame.value?.height ?? 0));
    const frameX = computed(() => -(currentFrame.value?.x ?? 0) + 'px');
    const frameY = computed(() => -(currentFrame.value?.y ?? 0) + 'px');

    let animationBackwards = false;
    let interval: number;

    function nextFrame(): void {
        if (animationBackwards) currentFrameIndex.value--;
        else currentFrameIndex.value++;

        if (currentFrameIndex.value > props.dto.frames.length - 1) {
            switch (props.dto.strategy) {
                case AnimationStrategy.Freeze:
                    currentFrameIndex.value--;
                    destroyInterval();
                    break;
                case AnimationStrategy.End:
                    destroyInterval();
                    break;
                case AnimationStrategy.Loop:
                    currentFrameIndex.value = 0;
                    break;
                case AnimationStrategy.PingPong:
                    animationBackwards = true;
                    currentFrameIndex.value--;
                    break;
            }
        } else if (currentFrameIndex.value < 0) {
            if (props.dto.strategy === AnimationStrategy.PingPong) {
                animationBackwards = false;
                currentFrameIndex.value++;
            }
        }
    }

    function initInterval(): void {
        interval = setInterval(nextFrame, props.dto.frameDuration);
    }

    function destroyInterval(): void {
        clearInterval(interval);
    }

    watch(() => props.dto.frames.length, () => {
        destroyInterval();
        if (props.dto.frames.length > 1) initInterval();
    }, {immediate: true});
</script>

<style scoped lang="less">
    .ui-sprite {
        border: var(--1-pix) solid var(--c-white);
        background: var(--c-black-faded);
        width: v-bind(width);
        height: v-bind(height);
        overflow: hidden;

        &__img {
            width: 100%;
            aspect-ratio: v-bind(frameRatio);
            object-position: v-bind(frameX) v-bind(frameY);
            scale: v-bind(scale);
            object-fit: none;
            transform-origin: top left;
        }
    }
</style>
