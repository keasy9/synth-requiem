import {Actor, Engine, SpriteSheet} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';

export const BulletType = {
    Wave: 0,
    Tank: 1,
    Plug: 2,
    But: 3,
    Stem: 4,
    Holy: 5,
    Chess: 6,
    Stack: 7,
    Stick: 8,
    Byte: 9,
    Bit: 10,
    Rocket: 11,
    Ball: 12,
    Ring: 13,
} as const;

export type AnyBulletType = typeof BulletType[keyof typeof BulletType];

const BulletSizeMap = {
    [BulletType.Wave]: {width: 3, height: 6},
    [BulletType.Tank]: {width: 3, height: 6},
    [BulletType.Plug]: {width: 3, height: 6},
    [BulletType.But]: {width: 3, height: 6},
    [BulletType.Stem]: {width: 3, height: 6},
    [BulletType.Holy]: {width: 3, height: 5},
    [BulletType.Chess]: {width: 3, height: 2},
    [BulletType.Stack]: {width: 2, height: 3},
    [BulletType.Stick]: {width: 1, height: 3},
    [BulletType.Byte]: {width: 1, height: 2},
    [BulletType.Bit]: {width: 1, height: 1},
    [BulletType.Rocket]: {width: 3, height: 4},
    [BulletType.Ball]: {width: 3, height: 3},
    [BulletType.Ring]: {width: 3, height: 6},
} as const;

export class Bullet extends Actor {

    protected static spriteSheet?: SpriteSheet;
    protected type: AnyBulletType;

    constructor(type: AnyBulletType = BulletType.Bit) {
        super();
        this.type = type;
    }

    protected makeSpriteFromType(): void {
        Bullet.spriteSheet ??= sprite(Resources.SpriteBullets)
            .autoRows(3)
            .sheet();

        const spriteFrame = Bullet.spriteSheet?.sprites[this.type];
        if (!spriteFrame) throw new Error(`Не найден спрайт для типа пули [${this.type}]`);

        spriteFrame.width = spriteFrame.sourceView.width = BulletSizeMap[this.type].width;
        spriteFrame.height = spriteFrame.sourceView.height = BulletSizeMap[this.type].height;

        this.graphics.use(spriteFrame);
    }

    protected makeColliderFromType(): void {
        this.collider.useBoxCollider(BulletSizeMap[this.type].width, BulletSizeMap[this.type].height);
    }

    public onInitialize(_engine: Engine): void {
        this.makeSpriteFromType();
        this.makeColliderFromType();
    }

    public setType(type: AnyBulletType): this {
        this.type = type;
        this.makeSpriteFromType();
        this.makeColliderFromType();
        return this;
    }

    public onPostUpdate(_engine: Engine, _elapsed: number) {
        if (this.isOffScreen) this.kill();
    }
}