import {DomElement, type DomElementDto, DomPositionAnchor} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';
import {Animation, AnimationStrategy, Sprite} from 'excalibur';
import type {Reactive} from 'vue';
import {reactive} from 'vue';

export type SpriteFrameDto = {
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
};

export interface DomSpriteDto extends DomElementDto {
    type: typeof DomElementType.Sprite;
    frames?: SpriteFrameDto[];
    frameDuration?: number;
    strategy?: AnimationStrategy;
    width?: number;
    height?: number;
    scale?: number;
}

export class DomSpriteElement extends DomElement {
    public name = `DomSprite#${this.id}`;

    protected _dto: Reactive<DomSpriteDto> = reactive({
        type: DomElementType.Sprite,
        anchor: DomPositionAnchor.Center,
        id: this.id,
    });

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

            this._dto.strategy = source.strategy;
            this._dto.frameDuration = source.frameDuration;

            source.frames
                .forEach(frame => {
                    if (frame.graphic instanceof Sprite) {
                        frames.push({
                            ...frame.graphic.sourceView,
                            src: frame.graphic.image.path,
                        });
                    }
                });

            this._dto.frames = frames;

        } else if (source instanceof Sprite) {
            this._dto.frames = [{
                ...source.sourceView,
                src: source.image.path,
            }];
        }

        this._dto.width = source.width;
        this._dto.height = source.height
        this._dto.scale = source.scale.x;

        return this;
    }

    /**
     * Установить масштабирование спрайта.
     * @param scale
     */
    public setScale(scale: number): this {
        this._dto.scale = scale;

        return this;
    }

    public addChild(_: DomElement): this {
        throw new Error('Нельзя добавлять дочерние элементы в спрайт!');
        return this;
    }
}