import {range, type Vector} from 'excalibur';
import {Config} from '@/config.ts';
import {GAME} from '@/main.ts';
import {vec} from 'excalibur';
import type {AnyFormationConf, GridFormationConf} from '@/level/events/enemyWave/types/Formation.ts';
import {FormationType} from '@/level/events/enemyWave/types/Formation.ts';
import {isDebug} from '@/utils/env.ts';

export class SpawnPointComputer {
    /**
     * Получить точку, отложенную на угол от центра экрана. Точка будет находиться за пределами экрана
     * @param angle угол в радианах
     */
    public static pointFromAngle(angle: number): Vector {
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
        const extra = isDebug() ? -10 : 10;

        // берем минимальное расстояние до ближайшей границы
        const t = Math.floor(Math.min(tX, tY)) + extra;

        // вычисляем конечную точку
        return vec(centerX + dirX * t, centerY + dirY * t);
    }

    /**
     * Находит точки спавна для всех врагов волны, основываясь на типе построения волны
     * @param angle угол в радианах к центру экрана, под которым будет центр волны
     * @param formationConf конфиг построения волны
     * @param enemyCount кол-во врагов в волне
     * @param enemySize размер врагов
     */
    public static formationPoints(
        angle: number,
        formationConf: AnyFormationConf,
        enemyCount: number,
        enemySize: {width: number, height: number},
    ): Vector[] {
        switch (formationConf.type) {
            case FormationType.Grid:
                return this.gridFormationPoints(angle, formationConf, enemyCount, enemySize);
        }
    }

    /**
     * Находит точки спавна для всех врагов волны для построения сеткой
     * @param angle угол в радианах к центру экрана, под которым будет центр волны
     * @param formationConf конфиг построения волны
     * @param enemyCount кол-во врагов в волне
     * @param enemySize размер врагов
     */
    protected static gridFormationPoints(
        angle: number,
        formationConf: GridFormationConf,
        enemyCount: number,
        enemySize: {width: number, height: number},
    ): Vector[] {
        const gap = {x: .5, y: .5, ...(formationConf.gap ?? {})};

        const cellSize = {
            width: enemySize.width + gap.x * enemySize.width,
            height: enemySize.height + gap.y * enemySize.height,
        };

        const colsCount = Math.min(
            formationConf.maxCols ?? Infinity,
            Math.floor(Config.width / cellSize.width) - 1, // -1 чтобы враги никогда не прилипали к краю экрана
            enemyCount,
        );

        // центр волны - середина правого края экрана
        const targetCenter = SpawnPointComputer.pointFromAngle(angle);

        // сначала в локальных координатах, при чём центр волны - центр правого края экрана
        let points = range(0, enemyCount)
            .map(i => {
                const row = Math.floor(i / colsCount);
                const col = i % colsCount;

                // Для каждой строки определяем сколько в ней точек
                const pointsInCurrentRow = (row === Math.floor((enemyCount - 1) / colsCount))
                    ? (enemyCount % colsCount || colsCount)
                    : colsCount;

                const x = row * cellSize.height;
                const y = (col - (pointsInCurrentRow - 1) / 2) * -cellSize.width;

                return vec(x, y);
            });

        // затем поворачиваем на угол смещения сетки
        points = points.map(p => p.rotate(formationConf.rotation ?? 0));
        // после поворота волна могла "вылезти" на экран, если центр нижнего ряда перестал быть границей экрана
        const minX = Math.ceil(Math.min(...points.slice(0, colsCount).map(p => p.x)));

        return points.map(p => p
            .add(vec(-minX, 0)) // смещаем чтобы нижняя граница волны была границей экрана
            .rotate(angle) // снова поворачиваем, но уже на угол волны
            .add(targetCenter)); // смещаем к целевому центру волны
    }
}