import {Actor, type Animation, CollisionType, type Engine, RentalPool, vec, Vector} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import type {InputPlayer} from '@/helpers/input/InputPlayer.ts';
import {inputPlayer} from '@/helpers/input/InputPlayer.ts';
import {Actions} from '@/helpers/input/sources/InputSource.ts';
import type {AnyBulletType, Bullet} from '@/entities/Bullet.ts';
import {BulletType} from '@/entities/Bullet.ts';
import {Exhaust, ExhaustType} from '@/entities/Exhaust.ts';

export const PlayerType = {
    White: 1,
    Yellow: 2,
    Green: 3,
    Purple: 4,
    Red: 5,
} as const;

export type AnyPlayerType = typeof PlayerType[keyof typeof PlayerType];

export class Player extends Actor {
    protected type: AnyPlayerType;
    protected sprite?: Animation;
    protected input: InputPlayer;
    protected exhausts: Exhaust[] = [];

    protected maxSpeed = 50;

    public constructor(type: AnyPlayerType = PlayerType.White) {
        super({
            collisionType: CollisionType.Active,
            width: 8,
            height: 8,
        });

        this.type = type;
        this.input = inputPlayer(0);
    }

    protected makeExhaustFromType(): void {
        this.exhausts.forEach(e => e.kill());

        switch (this.type) {
            case PlayerType.White:
                this.exhausts = [new Exhaust(ExhaustType.Medium).moveTo(1, 5.5)];
                break;

            case PlayerType.Yellow:
                this.exhausts = [
                    new Exhaust(ExhaustType.Small).moveTo(-1, 6.5),
                    new Exhaust(ExhaustType.Small).moveTo(4, 6.5).skipFrames(2),
                ];
                break;

            case PlayerType.Green:
                this.exhausts = [new Exhaust(ExhaustType.Medium).moveTo(1, 6.5)];
                break;

            case PlayerType.Purple:
                this.exhausts = [new Exhaust(ExhaustType.Large).moveTo(0, 5.5)];
                break;

            case PlayerType.Red:
                this.exhausts = [
                    new Exhaust(ExhaustType.Small).moveTo(0, 6.5),
                    new Exhaust(ExhaustType.Small).moveTo(3, 6.5).skipFrames(2),
                ];
                break;
        }

        this.exhausts.forEach(e => this.addChild(e));
    }

    protected moveExhaust(): void {
        let state = 'default';
        if (this.body.vel.x > 0) state = 'right';
        else if (this.body.vel.x < 0) state = 'left';

        switch (this.type) {
            case PlayerType.Yellow:
                this.exhausts[0]!.pos.x = state === 'right' ? 0 : -1;
                this.exhausts[1]!.pos.x = state === 'left' ? 3 : 4;
                break;

            case PlayerType.Red:
                this.exhausts[0]!.pos.x = state === 'left' ? 1 : 0;
                this.exhausts[1]!.pos.x = state === 'right' ? 2 : 3;
                break;
        }
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

        this.makeExhaustFromType();
    }

    public onPreUpdate(_engine: Engine, _elapsed: number) {
        const velocity = vec(0, 0);

        if (this.input.is(Actions.Left)) velocity.x--;
        if (this.input.is(Actions.Right)) velocity.x++;
        if (this.input.is(Actions.Up)) velocity.y--;
        if (this.input.is(Actions.Down)) velocity.y++;

        if (velocity.x > 0) this.sprite?.goToFrame(2);
        else if (velocity.x < 0) this.sprite?.goToFrame(0);
        else this.sprite?.goToFrame(1);

        this.body.vel = velocity.normalize().scaleEqual(this.maxSpeed);
        this.moveExhaust();
    }

    public getSpeed(): Vector {
        return this.body.vel;
    }

    public getPosition(): Vector {
        return this.body.pos;
    }
}