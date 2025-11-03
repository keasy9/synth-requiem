export const MovementType = {
    Linear: 'linear',
} as const;

interface MovementConf {
    type: typeof MovementType[keyof typeof MovementType],
    // скорость движения
    speed: number,
    // угол в радианах
    angle: number,
}

export interface LinearMovementConf extends MovementConf {
    type: typeof MovementType.Linear;
}

export type AnyMovementConf = LinearMovementConf;