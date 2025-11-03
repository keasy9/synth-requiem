import type {EnemyTypeKey} from '@/entities/Enemy.ts';
import {EnemyWave, type NormalizedEnemyConf} from '@/level/events/enemyWave/EnemyWave.ts';
import {SpawnPointComputer} from '@/level/events/enemyWave/SpawnPointComputer.ts';
import type {AnyFormationConf} from '@/level/events/enemyWave/types/Formation.ts';
import {vec} from 'excalibur';
import {EnemySize} from '@/entities/Enemy.ts';

type EnemyConf = {
    type: EnemyTypeKey, // тип врага
    spawnAngle: number, // угол в радианах, на котором от центра экрана спавнить врагов
}

type EnemyGroupConf =  EnemyConf & {
    count: number,
    formation: AnyFormationConf
};

type EnemyListConf = EnemyGroupConf | { enemies: EnemyConf[] };

export type EnemyWaveConf = EnemyListConf;

export class EnemyWaveFactory {
    public static create(conf: EnemyWaveConf): EnemyWave {
        if ('enemies' in conf) return new EnemyWave(this.parseEnemyList(conf.enemies));
        else return new EnemyWave(this.parseEnemyGroup(conf));
    }

    protected static parseEnemyList(conf: EnemyConf[]): NormalizedEnemyConf[] {
        return conf.map(enemyConf => {
            return {
                type: enemyConf.type,
                spawnPoint: SpawnPointComputer.pointFromAngle(enemyConf.spawnAngle),
            };
        });
    }

    protected static parseEnemyGroup(conf: EnemyGroupConf): NormalizedEnemyConf[] {
        const enemies = [];
        const spawnPoints = SpawnPointComputer.formationPoints(
            conf.spawnAngle,
            conf.formation,
            conf.count,
            EnemySize[conf.type],
        );

        for (let i = 0; i < conf.count; i++) {
            enemies.push({
                type: conf.type,
                spawnPoint: spawnPoints[i] ?? vec(0, 0),
            });
        }

        return enemies;
    }
}