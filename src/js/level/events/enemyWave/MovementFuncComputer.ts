import type {AnyMovementConf, LinearMovementConf} from '@/level/events/enemyWave/types/Movement.ts';
import {MovementType} from '@/level/events/enemyWave/types/Movement.ts';
import type {Enemy} from '@/entities/Enemy.ts';

export type EnemyMovementFunc = (enemy: Enemy, elapsed: number) => void;

export class MovementFuncComputer {
    public static getFunc(conf: AnyMovementConf, spawnAngle: number): EnemyMovementFunc {
        switch (conf.type) {
            case MovementType.Linear:
                conf.speed *= .02; // подобранный коэфициент, чтобы скорость 1 была нормальной
                return MovementFuncComputer.getLinearFunc(conf, spawnAngle);
        }
    }

    public static getLinearFunc(conf: LinearMovementConf, spawnAngle: number): EnemyMovementFunc {
        const waveAngle = conf.angle + (spawnAngle - Math.PI);
        const enemyAngle = waveAngle - Math.PI/2;
        const vx = Math.cos(waveAngle) * conf.speed;
        const vy = Math.sin(waveAngle) * conf.speed;

        return (enemy, elapsed) => {
            enemy.rotation = enemyAngle;
            enemy.pos.x += vx * elapsed;
            enemy.pos.y += vy * elapsed;
        };
    }
}