import type {EnumValue} from '@/utils/types.ts';

export const MovementType = {
    Linear: 'linear',
} as const;

interface MovementConf {
    type: EnumValue<typeof MovementType>,
    // скорость движения
    speed: number,
    // угол в радианах
    angle: number,
}

export interface LinearMovementConf extends MovementConf {
    type: typeof MovementType.Linear;
}

export type AnyMovementConf = LinearMovementConf;