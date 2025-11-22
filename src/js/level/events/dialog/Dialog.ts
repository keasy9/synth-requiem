import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import type {Engine} from 'excalibur';
import {EventBus, Events} from '@/helpers/events/EventBus.ts';
import {Monolog, type MonologConf} from '@/level/events/dialog/Monolog.ts';
import {GAME} from '@/main.ts';

export type DialogConf = {
    startMonolog: number, // индекс в monologues
    monologues: MonologConf[],
}

export class Dialog implements TimelineEvent {
    protected isStarted: boolean = false;
    protected conf: DialogConf;
    protected currentMonolog?: MonologConf;
    protected monologInstance?: Monolog;

    public static create(conf: DialogConf): Dialog {
        return new Dialog(conf);
    }

    public constructor(conf: DialogConf) {
        this.conf = conf;
    }

    public blockTimeline(): boolean {
        return this.isStarted;
    }

    public isEnded(): boolean {
        return this.currentMonolog !== undefined;
    }

    public onPreUpdate(_engine: Engine, _elapsed: number): void {
    }

    public start(): this {
        this.currentMonolog = this.conf.monologues[this.conf.startMonolog];
        this.isStarted = true;

        EventBus.emit(Events.DialogStarted);

        this.monologInstance = Monolog.create(this.currentMonolog!);
        GAME.add(this.monologInstance);

        return this;
    }
}