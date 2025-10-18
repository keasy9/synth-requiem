import type {ActionKey, InputSource} from '@/helpers/input/sources/InputSource.ts';
import {Actions} from '@/helpers/input/sources/InputSource.ts';
import {Axes, Buttons} from 'excalibur';
import {GAME} from '@/main.ts';

const AxisDirection = {
    Positive: '+',
    Negative: '-',
};

type AxisDirectionKey = typeof AxisDirection[keyof typeof AxisDirection];

type GamepadBindings = {
    buttons: Partial<Record<ActionKey, Buttons[]>>,
    axes: Partial<Record<ActionKey, {
        axis: Axes,
        direction: AxisDirectionKey,
    }[]>>,
}

export class Gamepad implements InputSource {
    protected index: number;
    protected buttonBindings: GamepadBindings['buttons'];
    protected axisBindings: GamepadBindings['axes'];

    public static defaultButtonBindings: GamepadBindings['buttons'] = {
        [Actions.Fire]: [Buttons.LeftTrigger, Buttons.RightTrigger],
    };

    public static defaultAxisBindings: GamepadBindings['axes'] = {
        [Actions.Left]: [{ axis: Axes.RightStickX, direction: AxisDirection.Negative }],
        [Actions.Right]: [{ axis: Axes.RightStickX, direction: AxisDirection.Positive }],
        [Actions.Up]: [{ axis: Axes.RightStickY, direction: AxisDirection.Positive }],
        [Actions.Down]: [{ axis: Axes.RightStickY, direction: AxisDirection.Negative }],
    };

    constructor(index: number, bindings: GamepadBindings = {} as GamepadBindings) {
        this.index = index;
        this.buttonBindings = Object.assign(Gamepad.defaultButtonBindings, bindings.buttons ?? {});
        this.axisBindings = Object.assign(Gamepad.defaultAxisBindings, bindings.axes ?? {});
    }

    protected isButton(action: ActionKey, method: 'wasButtonPressed' | 'isButtonHeld' | 'wasButtonReleased'): boolean {
        if (!this.buttonBindings[action]?.length) return false;

        for (let button of this.buttonBindings[action]) {
            if (GAME.input.gamepads.at(this.index)[method](button)) return true;
        }

        return false;
    }

    protected isAxis(action: ActionKey): boolean {
        if (!this.axisBindings[action]?.length) return false;

        for (let axisConfig of this.axisBindings[action]) {
            if (
                (GAME.input.gamepads.at(this.index).getAxes(axisConfig.axis) > 0 && axisConfig.direction === AxisDirection.Positive)
                || (GAME.input.gamepads.at(this.index).getAxes(axisConfig.axis) < 0 && axisConfig.direction === AxisDirection.Negative)
            ) return true;
        }

        return false;
    }

    public started(action: ActionKey): boolean {
        return this.isButton(action, 'wasButtonPressed') || this.isAxis(action);
    }

    public is(action: ActionKey): boolean {
        return this.isButton(action, 'isButtonHeld') || this.isAxis(action);
    }

    public ended(action: ActionKey): boolean {
        return this.isButton(action, 'wasButtonPressed') && !this.isAxis(action);
    }

    public analog(action: ActionKey): number {
        if (!this.axisBindings[action]?.length) return 0;

        for (let axisConfig of this.axisBindings[action]) {
            const value = GAME.input.gamepads.at(this.index).getAxes(axisConfig.axis);
            if (value > 0 && axisConfig.direction === AxisDirection.Positive) {
                return value;
            } else if (value < 0 && axisConfig.direction === AxisDirection.Negative) {
                return -value;
            }
        }

        return 0;
    }
}