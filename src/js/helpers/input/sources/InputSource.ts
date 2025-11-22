import type {EnumValue} from '@/utils/types.ts';

export const Actions = {
    Left: 'left',
    Right: 'right',
    Up: 'up',
    Down: 'down',
    Fire: 'fire',
} as const;

export type ActionKey = EnumValue<typeof Actions>;

export const InputSourceType = {
    Keyboard: 'keyboard',
    Gamepad: 'gamepad',
    // todo pointer
} as const;

export type AnyInputSourceType = EnumValue<typeof InputSourceType>;

export interface InputSource {
    readonly type: AnyInputSourceType;
    started(action: ActionKey): boolean;
    is(action: ActionKey): boolean;
    ended(action: ActionKey): boolean;
    analog(action: ActionKey): number;
    // todo методы для изменения биндингов в рантайме
}
