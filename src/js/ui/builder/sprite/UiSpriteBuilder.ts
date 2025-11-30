import {UiElemBuilder} from '@/ui/builder/UiElemBuilder.ts';
import {type SpriteFrameDto, UiSpriteDto} from '@/ui/builder/sprite/UiSpriteDto.ts';
import {type Animation, AnimationStrategy, Sprite} from 'excalibur';
import {type Reactive, reactive} from 'vue';

export class UiSpriteBuilder extends UiElemBuilder {
    protected _frames: SpriteFrameDto[] = [];
    protected _frameDuration: number = 100;
    protected _strategy: AnimationStrategy = AnimationStrategy.Freeze;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _scale: number = 1;

    /**
     * Создать из анимации.
     * @todo создание из SpriteSheet, Sprite и Sprite[].
     * @param source
     */
    public from(source: Animation): this {
        this._frameDuration = source.frameDuration;
        this._strategy = source.strategy;
        this._width = source.width;
        this._height = source.height;

        this._frames = [];

        source.frames
            .forEach(frame => {
                if (frame.graphic instanceof Sprite) {
                    this._frames.push({
                        ...frame.graphic.sourceView,
                        src: frame.graphic.image.path,
                    });
                }
            });

        return this;
    }

    /**
     * Установить скорость проигрывания, если кадров несколько.
     * @param frameDuration
     */
    public speed(frameDuration: number): this {
        this._frameDuration = frameDuration;
        return this;
    }

    /**
     * Установить кадры.
     * @param frames
     */
    public frames(...frames: SpriteFrameDto[]): this {
        this._frames = frames;
        return this;
    }

    /**
     * Установить тип проигрывания, если кадров несколько.
     * @param strategy
     */
    public type(strategy: AnimationStrategy): this {
        this._strategy = strategy;
        return this;
    }

    /**
     * Установить масштаб.
     * @param scale
     */
    public scale(scale: number): this {
        this._scale = scale;
        return this;
    }

    /**
     * @inheritDoc
     */
    public get(): Reactive<UiSpriteDto> {
        const instance = reactive(new UiSpriteDto());

        instance.frames = this._frames;
        instance.frameDuration = this._frameDuration;
        instance.strategy = this._strategy;
        instance.width = this._width;
        instance.height = this._height;
        instance.scale = this._scale;

        return instance;
    }

    /**
     * @inheritDoc
     */
    public show(): Reactive<UiSpriteDto> {
        const dto = this.get();

        dto.show();

        return dto;
    }
}
