import {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import {type Animation, AnimationStrategy, Sprite} from 'excalibur';

export type SpriteFrameDto = {
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
};

export class UiSpriteDto extends UiElemDto {
    public frames: SpriteFrameDto[] = [];
    public frameDuration: number = 100;
    public strategy: AnimationStrategy = AnimationStrategy.Freeze;
    public width: number = 0;
    public height: number = 0;
    public scale: number = 1;

    /**
     * Установить кадры из Animation.
     * @todo устанавливать кадры из SpriteSheet, Sprite и Sprite[]
     * @param npcPortrait
     */
    public setFramesFrom(source: Animation) {
        const frames: SpriteFrameDto[] = [];

        source.frames
            .forEach(frame => {
                if (frame.graphic instanceof Sprite) {
                    frames.push({
                        ...frame.graphic.sourceView,
                        src: frame.graphic.image.path,
                    });
                }
            });

        this.frames = frames;
    }
}
