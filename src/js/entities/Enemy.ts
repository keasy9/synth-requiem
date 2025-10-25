import {Actor, type Engine, type SpriteSheet} from 'excalibur';
import {Resources} from '@/resources.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';

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

export type EnemyTypeKey = typeof EnemyType[keyof typeof EnemyType];

export class Enemy extends Actor {

    protected static spriteSheet?: SpriteSheet;
    protected type: EnemyTypeKey;

    constructor(type: EnemyTypeKey = EnemyType.White) {
        super();
        this.type = type;
    }

    protected makeSpriteFromType(): void {
        const sprite = Enemy.spriteSheet?.sprites[this.type];
        if (!sprite) throw new Error(`Не найден спрайт для типа врага [${this.type}]`);

        this.graphics.use(sprite);
    }

    public onInitialize(_engine: Engine): void {
        Enemy.spriteSheet ??= sprite(Resources.SpriteEnemies)
            .autoCols(8)
            .autoRows(8)
            .sheet();

        this.makeSpriteFromType();
    }

    public setType(type: EnemyTypeKey): this {
        this.type = type;
        this.makeSpriteFromType();
        return this;
    }
}
