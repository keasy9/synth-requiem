import {Enemy, type AnyEnemyType} from '@/entities/Enemy.ts';
import {type Engine, type OnPreUpdate, RentalPool, type Vector} from 'excalibur';
import {GAME} from '@/main.ts';
import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import type {EnemyMovementFunc} from '@/level/events/enemyWave/MovementFuncComputer.ts';

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

    constructor(conf: NormalizedEnemyConf[]) {
        EnemyWave.pool ??= new RentalPool(
            () => new Enemy(),
            enemy => {
                enemy.vel.x = enemy.vel.y = enemy.rotation = enemy.pos.x = enemy.pos.y = 0;
                return enemy;
            },
        );

        this.enemyConfList = conf;
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

        return this;
    }

    public onPreUpdate(_engine: Engine, elapsed: number) {
        this.enemies.forEach((enemy, i) => this.enemyConfList[i]?.movement(enemy, elapsed));
    }

    public isEnded(): boolean {
        // todo
        return false;
    }

    public blockTimeline(): boolean {
        return false;
    }
}
