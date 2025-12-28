import {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import {Animation, AnimationStrategy, Sprite} from 'excalibur';

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
     * Создать из Animation или Sprite.
     * @todo из SpriteSheet и Sprite[]
     * @param source
     */
    public static make(source?: Animation|Sprite): UiSpriteDto {
        const instance = new this();
        if (!source) return instance;

        instance.width = source.width;
        instance.height = source.height
        instance.scale = source.scale.x;

        return instance.framesFrom(source);
    }

    /**
     * Установить кадры из Animation или Sprite.
     * @todo из SpriteSheet и Sprite[]
     * @param source
     */
    public framesFrom(source: Animation|Sprite): this {
        if (source instanceof Animation) {
            const frames: SpriteFrameDto[] = [];

            this.strategy = source.strategy;
            this.frameDuration = source.frameDuration;

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

        } else if (source instanceof Sprite) {
            this.frames = [{
                ...source.sourceView,
                src: source.image.path,
            }];
        }

        return this;
    }

    /**
     * Установить скорость проигрывания, если кадров несколько.
     * @param frameDuration
     */
    public speed(frameDuration: number): this {
        this.frameDuration = frameDuration;
        return this;
    }

    /**
     * Установить кадры.
     * @param frames
     */
    public withFrames(...frames: SpriteFrameDto[]): this {
        this.frames = frames;
        return this;
    }

    /**
     * Установить тип проигрывания, если кадров несколько.
     * @param strategy
     */
    public type(strategy: AnimationStrategy): this {
        this.strategy = strategy;
        return this;
    }

    /**
     * Установить масштаб.
     * @param scale
     */
    public scaleBy(scale: number): this {
        this.scale = scale;
        return this;
    }
}
