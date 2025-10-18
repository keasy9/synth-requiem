export const Actions = {
    Left: 'left',
    Right: 'right',
    Up: 'up',
    Down: 'down',
    Fire: 'fire',
} as const;

export type ActionKey = typeof Actions[keyof typeof Actions];

// todo описать pointer, keyboard и gamepad от этого интерфейса
// todo класс InputPlayer - содержит в себе InputSource'ы
export interface InputSource {
    started(action: ActionKey): boolean;
    is(action: ActionKey): boolean;
    ended(action: ActionKey): boolean;
    analog(action: ActionKey): number;
    // todo методы для изменения биндингов в рантайме
}
