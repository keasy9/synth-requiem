<template>
    <div class="ui-sprite" ref="root">
        <img v-if="currentFrame" class="ui-sprite__img" :src="currentFrame.src" alt="">
    </div>
</template>

<script setup lang="ts">
    import type {SpriteFrameDto} from '@/ui/dto/UiSpriteDto.ts';
    import {computed, ref, useTemplateRef, watch} from 'vue';
    import {Config} from '@/config.ts';
    import {AnimationStrategy} from 'excalibur';
    import {setElem} from '@/ui/renderer/utils/setElem.ts';
    import type {DomSpriteElement} from '@/ui/entities/DomSpriteElement.ts';

    const props = defineProps<{ entity: DomSpriteElement }>();
    const root = useTemplateRef<HTMLDivElement>('root');

    const scale = computed(() => Config.baseScale * props.entity.scale);
    const width = computed(() => props.entity.width * scale.value + 'px');
    const height = computed(() => props.entity.height * scale.value + 'px');

    const currentFrameIndex = ref<number>(0);
    const currentFrame = computed<SpriteFrameDto|undefined>(() => props.entity.frames[currentFrameIndex.value]);
    const frameRatio = computed(() => (currentFrame.value?.width ?? 0) / (currentFrame.value?.height ?? 0));
    const frameX = computed(() => -(currentFrame.value?.x ?? 0) + 'px');
    const frameY = computed(() => -(currentFrame.value?.y ?? 0) + 'px');

    let animationBackwards = false;
    let interval: number;

    function nextFrame(): void {
        if (animationBackwards) currentFrameIndex.value--;
        else currentFrameIndex.value++;

        if (currentFrameIndex.value > props.entity.frames.length - 1) {
            switch (props.entity.strategy) {
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
            if (props.entity.strategy === AnimationStrategy.PingPong) {
                animationBackwards = false;
                currentFrameIndex.value++;
            }
        }
    }

    function initInterval(): void {
        interval = setInterval(nextFrame, props.entity.frameDuration);
    }

    function destroyInterval(): void {
        clearInterval(interval);
    }

    watch(() => props.entity.frames.length, () => {
        destroyInterval();
        if (props.entity.frames.length > 1) initInterval();
    }, {immediate: true});

    setElem(root, props.entity);
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
