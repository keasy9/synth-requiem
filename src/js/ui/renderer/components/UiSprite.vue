<template>
    <div class="ui-sprite" ref="root">
        <img v-if="currentFrame" class="ui-sprite__img" :src="currentFrame.src" alt="">
    </div>
</template>

<script setup lang="ts">
    import {computed, ref, useTemplateRef, watch} from 'vue';
    import {Config} from '@/config.ts';
    import {AnimationStrategy} from 'excalibur';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';
    import type {DomSpriteDto, SpriteFrameDto} from '@/ui/entities/DomSpriteElement.ts';

    const props = defineProps<{ dto: DomSpriteDto }>();
    const root = useTemplateRef<HTMLDivElement>('root');

    const scale = computed(() => Config.baseScale * (props.dto.scale ?? 1));
    const width = computed(() => (props.dto.width ?? 50) * scale.value + 'px');
    const height = computed(() => (props.dto.height ?? 50) * scale.value + 'px');

    const currentFrameIndex = ref<number>(0);
    const currentFrame = computed<SpriteFrameDto|undefined>(() => props.dto.frames ? props.dto.frames[currentFrameIndex.value] : undefined);
    const frameRatio = computed(() => (currentFrame.value?.width ?? 0) / (currentFrame.value?.height ?? 0));
    const frameX = computed(() => -(currentFrame.value?.x ?? 0) + 'px');
    const frameY = computed(() => -(currentFrame.value?.y ?? 0) + 'px');

    let animationBackwards = false;
    let interval: number;

    function nextFrame(): void {
        if (animationBackwards) currentFrameIndex.value--;
        else currentFrameIndex.value++;

        if (currentFrameIndex.value > (props.dto.frames?.length ?? 0) - 1) {
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

    watch(() => props.dto.frames?.length, () => {
        destroyInterval();
        if (props.dto.frames?.length && props.dto.frames?.length > 1) initInterval();
    }, {immediate: true});

    setElem(root, props.dto.id);
</script>

<style lang="less">
    .ui-sprite {
        overflow: hidden;

        &__img {
            width: 100%;
            object-fit: none;
            transform-origin: top left;
        }
    }
</style>

<style scoped lang="less">
    .ui-sprite {
        width: v-bind(width);
        height: v-bind(height);

        &__img {
            aspect-ratio: v-bind(frameRatio);
            object-position: v-bind(frameX) v-bind(frameY);
            scale: v-bind(scale);
        }
    }
</style>
