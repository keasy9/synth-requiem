import type {ActionKey, InputSource, InputSourceTypeKey} from '@/helpers/input/sources/InputSource.ts';
import type {KeyboardBindings} from '@/helpers/input/sources/Keyboard.ts';
import {InputSourceType} from '@/helpers/input/sources/InputSource.ts';
import {Keyboard} from '@/helpers/input/sources/Keyboard.ts';
import type {GamepadBindings} from '@/helpers/input/sources/Gamepad.ts';
import {Gamepad} from '@/helpers/input/sources/Gamepad.ts';

export class InputPlayer {
    protected sources: Record<InputSourceTypeKey, InputSource> = {} as Record<InputSourceTypeKey, InputSource>;

    public bindKeyboard(bindings?: KeyboardBindings): this {
        this.sources[InputSourceType.Keyboard] = new Keyboard(bindings);
        return this;
    }

    public bindGamepad(index: number, bindings?: GamepadBindings): this {
        this.sources[InputSourceType.Gamepad] = new Gamepad(index, bindings);
        return this;
    }

    protected isAction(action: ActionKey, method: 'started' | 'is' | 'ended'): boolean {
        for (const source of Object.values(this.sources)) {
            if (source[method](action)) return true;
        }

        return false;
    }

    public started(action: ActionKey): boolean {
        return this.isAction(action, 'started');
    }

    public is(action: ActionKey): boolean {
        return this.isAction(action, 'is');
    }

    public ended(action: ActionKey): boolean {
        return this.isAction(action, 'ended');
    }

    public analog(action: ActionKey): number {
        const results: number[] = [];
        for (const source of Object.values(this.sources)) {
            const val = source.analog(action);
            if (val === 1) return val;
            results.push(val);
        }

        return results.length ? Math.max(...results) : 0;
    }
}

const instances: InputPlayer[] = [];

export function inputPlayer(player: number): InputPlayer {
    if (!instances[player]) {
        instances[player] = new InputPlayer().bindKeyboard().bindGamepad(player);
    }

    return instances[player];
}
