import {Enemy, type EnemyTypeKey} from '@/entities/Enemy.ts';
import {type Engine, type OnPreUpdate, Pool} from 'excalibur';
import {GAME} from '@/main.ts';
import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';

type EnemyConf = {
    type: EnemyTypeKey,
}

type EnemyListConf = ({ count: number } & EnemyConf) | { enemies: EnemyConf[] };

export type EnemyWaveConf = EnemyListConf;

export class EnemyWave implements OnPreUpdate, TimelineEvent {
    protected static pool: Pool<Enemy>;

    protected enemyConfList: EnemyConf[] = [];
    protected enemies: Enemy[] = [];

    constructor(conf: EnemyWaveConf) {
        EnemyWave.pool ??= new Pool(
            () => new Enemy(),
            enemy => {
                enemy.vel.x = enemy.vel.y = enemy.rotation = enemy.pos.x = enemy.pos.y = 0;
                return enemy;
            },
        );

        this.computeTypes(conf);
    }

    protected computeTypes(conf: EnemyWaveConf): void {
        if ('enemies' in conf) {
            // список врагов, каждый враг со своим поведением
            this.enemyConfList = conf.enemies;

        } else {
            // группа врагов с одинаковым поведением
            while (this.enemyConfList.length < conf.count) {
                this.enemyConfList.push({
                    type: conf.type,
                });
            }
        }
    }

    public start(): this {
        this.enemyConfList.forEach(conf => {
            const enemy = EnemyWave.pool.get().setType(conf.type);
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
