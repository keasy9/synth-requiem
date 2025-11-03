export const FormationType = {
    Grid: 'grid',
} as const;

interface FormationConf {
    type: typeof FormationType[keyof typeof FormationType];
}

export interface GridFormationConf extends FormationConf {
    type: typeof FormationType.Grid,
    // будет умножен на размер врага
    gap?: { x?: number, y?: number },
    // в любом случае ограничено шириной экрана
    maxCols?: number,
    // угол поворота всей сетки в радианах
    rotation?: number,
}

export type AnyFormationConf = GridFormationConf;
