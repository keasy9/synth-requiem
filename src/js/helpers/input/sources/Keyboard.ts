import {type ActionKey, Actions, type InputSource} from '@/helpers/input/sources/InputSource.ts';
import {Keys} from 'excalibur';
import {GAME} from '@/main.ts';

type KeyboardBindings = Partial<Record<ActionKey, Keys[]>>;

export class Keyboard implements InputSource {
    protected keyBindings: KeyboardBindings

    public static defaultKeyBindings: KeyboardBindings = {
        [Actions.Left]: [Keys.Left, Keys.A],
        [Actions.Right]: [Keys.Right, Keys.D],
        [Actions.Up]: [Keys.Up, Keys.W],
        [Actions.Down]: [Keys.Down, Keys.S],
        [Actions.Fire]: [Keys.Space],
    };

    public constructor(bindings: KeyboardBindings = {} as KeyboardBindings) {
        this.keyBindings = Object.assign(Keyboard.defaultKeyBindings, bindings);
    }

    protected isAction(action: ActionKey, method: 'wasPressed' | 'isHeld' | 'wasReleased'): boolean {
        if (!this.keyBindings[action]?.length) return false;

        for (let key of this.keyBindings[action]) {
            if (GAME.input.keyboard[method](key)) return true;
        }

        return false;
    }

    public started(action: ActionKey): boolean {
        return this.isAction(action, 'wasPressed');
    }

    public is(action: ActionKey): boolean {
        return this.isAction(action, 'isHeld');
    }

    public ended(action: ActionKey): boolean {
        return this.isAction(action, 'wasReleased');
    }

    public analog(action: ActionKey): number {
        return this.is(action) ? 1 : 0;
    }
}
