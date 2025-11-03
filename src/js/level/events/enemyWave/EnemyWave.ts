import {Enemy, type EnemyTypeKey} from '@/entities/Enemy.ts';
import {type Engine, type OnPreUpdate, RentalPool, type Vector} from 'excalibur';
import {GAME} from '@/main.ts';
import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';

export type NormalizedEnemyConf = {
    type: EnemyTypeKey,
    spawnPoint: Vector,
}

export class EnemyWave implements OnPreUpdate, TimelineEvent {
    protected static pool: RentalPool<Enemy>; // todo RentalPool

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
            enemy.setType(conf.type)
            enemy.pos = conf.spawnPoint;
            this.enemies.push(enemy);
            GAME.add(enemy);
        });

        return this;
    }

    public onPreUpdate(_engine: Engine, _elapsed: number) {
        // todo
    }

    public isEnded(): boolean {
        // todo
        return false;
    }

    public blockTimeline(): boolean {
        return false;
    }
}
