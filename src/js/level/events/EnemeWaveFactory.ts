import type {EnemyTypeKey} from '@/entities/Enemy.ts';
import {EnemyWave, type NormalizedEnemyConf} from '@/level/events/EnemyWave.ts';
import {vec, type Vector} from 'excalibur';
import {Config} from '@/config.ts';
import {GAME} from '@/main.ts';

type EnemyConf = {
    type: EnemyTypeKey, // тип врага
    spawnAngle: number, // угол в радианах, на котором от центра экрана спавнить врагов
}

type EnemyGroupConf = ({ count: number } & EnemyConf);

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
                spawnPoint: this.getSpawnPointFromAngle(enemyConf.spawnAngle),
            };
        });
    }

    protected static parseEnemyGroup(conf: EnemyGroupConf): NormalizedEnemyConf[] {
        const enemies = [];
        const spawnPoint = this.getSpawnPointFromAngle(conf.spawnAngle);

        for (let i = 0; i < conf.count; i++) {
            enemies.push({
                type: conf.type,
                spawnPoint: spawnPoint, // todo
            });
        }

        return enemies;
    }

    /**
     * Получить точку, отложенную на угол от центра экрана. Точка будет находиться за пределами экрана
     * @param angle
     * @protected
     */
    protected static getSpawnPointFromAngle(angle: number): Vector {
        // центр экрана
        const centerX = Config.width / 2;
        const centerY = Config.height / 2;

        // поправка на область отрисовки
        const offsetX = (GAME.drawWidth - Config.width) / 2;
        const offsetY = (GAME.drawHeight - Config.height) / 2;

        // направляющий вектор
        const dirX = Math.cos(angle);
        const dirY = Math.sin(angle);

        // вычисляем расстояние до каждой границы в заданном направлении
        let tX = Number.MAX_VALUE;
        let tY = Number.MAX_VALUE;

        if (dirX > 0) {
            tX = (Config.width + offsetX - centerX) / dirX;
        } else if (dirX < 0) {
            tX = (-offsetX - centerX) / dirX;
        }

        if (dirY > 0) {
            tY = (Config.height + offsetY - centerY) / dirY;
        } else if (dirY < 0) {
            tY = (-offsetY - centerY) / dirY;
        }

        // добавляем запас чтобы точка гарантированно была за экраном
        const extra = 10;

        // берем минимальное расстояние до ближайшей границы
        const t = Math.floor(Math.min(tX, tY)) + extra;

        // вычисляем конечную точку
        return vec(centerX + dirX * t, centerY + dirY * t);
    }
}