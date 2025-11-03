import {Actor, type Animation, AnimationStrategy, type Engine} from 'excalibur';
import {Resources} from '@/resources.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';

export const ExhaustType = {
    Small: 0,
    Medium: 1,
    Large: 2,
} as const;

type AnyExhaustType = typeof ExhaustType[keyof typeof ExhaustType];

export const ExhaustColor = {
    Orange: 1,
    Green: 2,
}

type AnyExhaustColor = typeof ExhaustColor[keyof typeof ExhaustColor];

// todo цвет
export class Exhaust extends Actor {

    protected type: AnyExhaustType;
    protected startFrame?: number;

    public constructor(type: AnyExhaustType = ExhaustType.Small) {
        super();
        this.type = type;
    }

    protected makeSpriteFromTypeAngColor(): void {
        const typeFrame = this.type * 8;
        this.graphics.use(
            sprite(Resources.SpriteExhausts)
                .cols(8)
                .rows(3)
                .from(typeFrame)
                .to(typeFrame + 3)
                .anim(AnimationStrategy.Loop, 80)
        );

        if (this.startFrame) {
            (this.graphics.current as Animation).goToFrame(this.startFrame);
            delete this.startFrame;
        }
    }

    public onInitialize(_engine: Engine) {
        this.makeSpriteFromTypeAngColor();
    }

    public moveTo(x: number, y: number): this {
        this.pos.x = x;
        this.pos.y = y;
        return this;
    }

    public skipFrames(frames: number): this {
        const graphics = this.graphics.current as Animation;
        if (graphics) graphics.goToFrame(frames)
        else this.startFrame = frames;
        return this;
    }
}
