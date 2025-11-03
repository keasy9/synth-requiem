export const Actions = {
    Left: 'left',
    Right: 'right',
    Up: 'up',
    Down: 'down',
    Fire: 'fire',
} as const;

export type ActionKey = typeof Actions[keyof typeof Actions];

export const InputSourceType = {
    Keyboard: 'keyboard',
    Gamepad: 'gamepad',
    // todo pointer
} as const;

export type AnyInputSourceType = typeof InputSourceType[keyof typeof InputSourceType];

export interface InputSource {
    readonly type: AnyInputSourceType;
    started(action: ActionKey): boolean;
    is(action: ActionKey): boolean;
    ended(action: ActionKey): boolean;
    analog(action: ActionKey): number;
    // todo методы для изменения биндингов в рантайме
}
