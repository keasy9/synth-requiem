import type {AnyEnemyType} from '@/entities/Enemy.ts';
import {EnemyWave, type NormalizedEnemyConf} from '@/level/events/enemyWave/EnemyWave.ts';
import {SpawnPointComputer} from '@/level/events/enemyWave/SpawnPointComputer.ts';
import type {AnyFormationConf} from '@/level/events/enemyWave/types/Formation.ts';
import {vec} from 'excalibur';
import {EnemySizeMap} from '@/entities/Enemy.ts';
import {MovementFuncComputer} from '@/level/events/enemyWave/MovementFuncComputer.ts';
import type {AnyMovementConf} from '@/level/events/enemyWave/types/Movement.ts';

type EnemyConf = {
    type: AnyEnemyType, // тип врага
    spawnAngle: number, // угол в радианах, на котором от центра экрана спавнить врагов
    movement: AnyMovementConf,
    health?: number, // множитель
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
                movement: MovementFuncComputer.getFunc(enemyConf.movement, enemyConf.spawnAngle),
                health: enemyConf.health ?? 1,
            };
        });
    }

    protected static parseEnemyGroup(conf: EnemyGroupConf): NormalizedEnemyConf[] {
        const enemies = [];

        const spawnPoints = SpawnPointComputer.formationPoints(
            conf.spawnAngle,
            conf.formation,
            conf.count,
            EnemySizeMap[conf.type],
        );
        const movementFunc = MovementFuncComputer.getFunc(conf.movement, conf.spawnAngle);

        for (let i = 0; i < conf.count; i++) {
            enemies.push({
                type: conf.type,
                spawnPoint: spawnPoints[i] ?? vec(0, 0),
                movement: movementFunc,
                health: conf.health ?? 1,
            });
        }

        return enemies;
    }
}