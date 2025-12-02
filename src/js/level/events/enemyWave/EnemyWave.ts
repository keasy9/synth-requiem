import {Enemy, type AnyEnemyType} from '@/entities/Enemy.ts';
import {BoundingBox, type Engine, type OnPreUpdate, RentalPool, type Vector} from 'excalibur';
import {GAME} from '@/main.ts';
import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import type {EnemyMovementFunc} from '@/level/events/enemyWave/MovementFuncComputer.ts';
import {Config} from '@/config.ts';

export type NormalizedEnemyConf = {
    type: AnyEnemyType,
    spawnPoint: Vector,
    movement: EnemyMovementFunc,
    health: number, // множитель
}

export class EnemyWave implements OnPreUpdate, TimelineEvent {
    protected static pool: RentalPool<Enemy>;

    protected enemyConfList: NormalizedEnemyConf[] = [];
    protected enemies: Enemy[] = [];
    protected deathBounds: BoundingBox;
    protected isStarted: boolean = false;

    constructor(conf: NormalizedEnemyConf[]) {
        EnemyWave.pool ??= new RentalPool(
            () => new Enemy(),
            enemy => {
                enemy.vel.x = enemy.vel.y = enemy.rotation = enemy.pos.x = enemy.pos.y = 0;
                return enemy;
            },
        );

        this.enemyConfList = conf;

        const boundsGap = Config.width;
        this.deathBounds = GAME.screenBox;
        this.deathBounds.top -= boundsGap;
        this.deathBounds.bottom += boundsGap;
        this.deathBounds.left -= boundsGap;
        this.deathBounds.right += boundsGap;
    }

    public start(): this {
        this.enemyConfList.forEach(conf => {
            const enemy = EnemyWave.pool.rent();
            enemy.setType(conf.type);
            enemy.setHealth(conf.health);
            enemy.pos = conf.spawnPoint;
            this.enemies.push(enemy);
            GAME.add(enemy);
        });

        this.isStarted = true;

        return this;
    }

    public onPreUpdate(_engine: Engine, elapsed: number) {
        const killedEnemyIndexes: number[] = [];
        this.enemies.forEach((enemy, index) => {
            this.enemyConfList[index]?.movement(enemy, elapsed);

            if (enemy.isOffScreen && !this.deathBounds.contains(enemy.pos)) {
                enemy.kill();
                killedEnemyIndexes.push(index);
            }
        });

        this.enemies = this.enemies.filter((_, index) => !killedEnemyIndexes.includes(index));
    }

    public isEnded(): boolean {
        return this.isStarted && !this.enemies.length;
    }

    public blockTimeline(): boolean {
        return !!this.enemies.find(e => !e.wasShown);
    }
}
