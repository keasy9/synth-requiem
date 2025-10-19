import {Actor, type Animation, type Engine, vec} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import type {InputPlayer} from '@/helpers/input/InputPlayer.ts';
import {inputPlayer} from '@/helpers/input/InputPlayer.ts';
import {Actions} from '@/helpers/input/sources/InputSource.ts';

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
    protected input: InputPlayer;

    protected maxSpeed = 50;

    public constructor(type: PlayerTypeKey = PlayerType.White) {
        super();

        this.type = type;
        this.input = inputPlayer(0);
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

    public onPreUpdate(engine: Engine, elapsed: number) {
        const velocity = vec(0, 0);

        if (this.input.is(Actions.Left)) velocity.x--;
        if (this.input.is(Actions.Right)) velocity.x++;
        if (this.input.is(Actions.Up)) velocity.y--;
        if (this.input.is(Actions.Down)) velocity.y++;

        if (velocity.x > 0) this.sprite?.goToFrame(2);
        else if (velocity.x < 0) this.sprite?.goToFrame(0);
        else this.sprite?.goToFrame(1);

        this.body.vel = velocity.normalize().scaleEqual(this.maxSpeed);
    }
}