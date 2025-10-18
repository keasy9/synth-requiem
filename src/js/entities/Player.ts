import {Actor, type Animation, type Engine} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';

export const PlayerType = {
    White: 1,
    Yellow: 2,
    Green: 3,
    Purple: 4,
    Red: 5,
} as const;

export type PlayerTypeKey = typeof PlayerType[keyof typeof PlayerType];

export class Player extends Actor {
    protected type: PlayerTypeKey;
    protected sprite?: Animation;

    public constructor(type: PlayerTypeKey = PlayerType.White) {
        super();

        this.type = type;
    }

    public onInitialize(_engine: Engine) {
        this.sprite = sprite(Resources.SpritePlayers)
            .autoWidth(3)
            .height(8)
            .row(this.type)
            .anim();

        this.sprite.pause();
        this.sprite.goToFrame(1);

        this.graphics.use(this.sprite);
    }
}