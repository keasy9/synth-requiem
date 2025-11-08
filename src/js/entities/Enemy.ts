import {Actor, Color, type Engine, type SpriteSheet, Timer} from 'excalibur';
import {Resources} from '@/resources.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import type {DamageTaker} from '@/entities/interfaces/DamageTaker.ts';
import {collide} from '@/helpers/physics/Collider.ts';
import {CollisionGroups} from '@/helpers/physics/CollisionGroups.ts';
import {Explosion, ExplosionType} from '@/entities/Explosion.ts';
import type {DamageProvider} from '@/entities/interfaces/DamageProvider.ts';
import {GAME} from '@/main.ts';

// значение - кадр в спрайте
export const EnemyType = {
    White: 0,
    Fork: 1,
    Trident: 2,
    Ocean: 4,
    Grass: 5,
    Crab: 6,
    Dark: 7,
    Girl: 8,
    Peak: 9,
    Sun: 10,
    Spoon: 11,
    Tiny: 12,
    Tree: 13,
    Woman: 14,
    Star: 15,
    Rocket: 16,
    Brown: 17,
    Ball: 18,
    Wedge: 19,
    Foot: 20,
    Handsome: 21,
    Fish: 22,
    Knuckle: 23,
    Drop: 24,
    Devil: 25,
    Goat: 26,
    Beetle: 27,
    Grig: 28,
    Puddle: 29,
    Hugger: 30,
    Sea: 31,
    Head: 32,
    Hasher: 33,
    Grip: 34,
    Butt: 35,
    Glider: 36,
} as const;

export type AnyEnemyType = typeof EnemyType[keyof typeof EnemyType];

export const EnemySizeMap = {
    [EnemyType.White]: {width: 5, height: 5},
    [EnemyType.Fork]: {width: 7, height: 5},
    [EnemyType.Trident]: {width: 5, height: 5},
    [EnemyType.Ocean]: {width: 6, height: 4},
    [EnemyType.Grass]: {width: 5, height: 4},
    [EnemyType.Crab]: {width: 7, height: 5},
    [EnemyType.Dark]: {width: 6, height: 4},
    [EnemyType.Girl]: {width: 6, height: 4},
    [EnemyType.Peak]: {width: 5, height: 5},
    [EnemyType.Sun]: {width: 6, height: 5},
    [EnemyType.Spoon]: {width: 6, height: 5},
    [EnemyType.Tiny]: {width: 4, height: 5},
    [EnemyType.Tree]: {width: 7, height: 6},
    [EnemyType.Woman]: {width: 8, height: 6},
    [EnemyType.Star]: {width: 6, height: 6},
    [EnemyType.Rocket]: {width: 5, height: 6},
    [EnemyType.Brown]: {width: 8, height: 5},
    [EnemyType.Ball]: {width: 6, height: 5},
    [EnemyType.Wedge]: {width: 6, height: 6},
    [EnemyType.Foot]: {width: 6, height: 6},
    [EnemyType.Handsome]: {width: 6, height: 6},
    [EnemyType.Fish]: {width: 5, height: 6},
    [EnemyType.Knuckle]: {width: 6, height: 5},
    [EnemyType.Drop]: {width: 8, height: 6},
    [EnemyType.Devil]: {width: 8, height: 8},
    [EnemyType.Goat]: {width: 8, height: 8},
    [EnemyType.Beetle]: {width: 8, height: 8},
    [EnemyType.Grig]: {width: 8, height: 7},
    [EnemyType.Puddle]: {width: 6, height: 6},
    [EnemyType.Hugger]: {width: 8, height: 6},
    [EnemyType.Sea]: {width: 8, height: 6},
    [EnemyType.Head]: {width: 6, height: 8},
    [EnemyType.Hasher]: {width: 6, height: 6},
    [EnemyType.Grip]: {width: 6, height: 6},
    [EnemyType.Butt]: {width: 6, height: 6},
    [EnemyType.Glider]: {width: 8, height: 7},
} as const;

export class Enemy extends Actor implements DamageTaker, DamageProvider {

    protected static spriteSheet?: SpriteSheet;
    protected static baseHealth: number = 2;

    protected type: AnyEnemyType;
    protected health: number = 10;
    protected _damage: number = 10;

    constructor(type: AnyEnemyType = EnemyType.White) {
        super({ collisionGroup: CollisionGroups.Enemy });
        this.type = type;
        this.setHealth();
    }

    protected makeSpriteFromType(): void {
        Enemy.spriteSheet ??= sprite(Resources.SpriteEnemies)
            .autoCols(8)
            .autoRows(8)
            .sheet();

        const spriteFrame = Enemy.spriteSheet?.sprites[this.type]?.clone();
        if (!spriteFrame) throw new Error(`Не найден спрайт для типа врага [${this.type}]`);

        spriteFrame.width = spriteFrame.sourceView.width = EnemySizeMap[this.type].width;
        spriteFrame.height = spriteFrame.sourceView.height = EnemySizeMap[this.type].height;

        this.graphics.use(spriteFrame);
    }

    protected makeColliderFromType(): void {
        this.collider.useBoxCollider(EnemySizeMap[this.type].width, EnemySizeMap[this.type].height);
        collide(this);
    }

    public onInitialize(_engine: Engine): void {
        this.makeSpriteFromType();
        this.makeColliderFromType();
    }

    public setType(type: AnyEnemyType): this {
        this.type = type;
        this.makeSpriteFromType();
        this.makeColliderFromType();
        this.setHealth();
        return this;
    }

    public setHealth(multiplier: number = 1) {
        this.health = (this.type + 1) * Enemy.baseHealth * multiplier;
    }

    public takeDamage(damage: number) {
        // todo выводить цифру сколько урона нанесено
        this.health -= damage;

        const sprite = this.graphics.current;

        if (sprite) {
            sprite.tint = Color.Orange;
            GAME.add(new Timer({
                interval: 100,
                action: () => delete sprite.tint,
            }).start());
        }

        if (this.health <= 0) this.explode()
    }

    public get damage(): number {
        return this._damage;
    }

    protected explode() {
        this.kill();
        Explosion.explode(ExplosionType.Orange, this.pos);
    }
}
