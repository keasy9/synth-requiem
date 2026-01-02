import {DomElement} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';
import {Animation, AnimationStrategy, Sprite} from 'excalibur';

export type SpriteFrameDto = {
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
};

export class DomSpriteElement extends DomElement {
    public name = `DomSprite#${this.id}`;

    public frames: SpriteFrameDto[] = [];
    public frameDuration: number = 100;
    public strategy: AnimationStrategy = AnimationStrategy.Freeze;
    public width: number = 0;
    public height: number = 0;
    public scale: number = 1;

    constructor() {
        super(DomElementType.Sprite);
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

        this.width = source.width;
        this.height = source.height
        this.scale = source.scale.x;

        return this;
    }

    /**
     * Установить масштабирование спрайта.
     * @param scale
     */
    public setScale(scale: number): this {
        this.scale = scale;
        return this;
    }

    public addChild(_: DomElement): this {
        throw new Error('Нельзя добавлять дочерние элементы в спрайт!');
        return this;
    }
}