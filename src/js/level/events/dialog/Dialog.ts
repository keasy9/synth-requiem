import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import type {Engine} from 'excalibur';
import {EventBus, Events} from '@/helpers/events/EventBus.ts';
import {type MonologConf} from '@/level/events/dialog/Monolog.ts';
import type {UiContainerDto} from '@/helpers/ui/container/UiContainerDto.ts';
import {ui} from '@/helpers/ui/Ui.ts';
import type {UiTextboxDto} from '@/helpers/ui/textbox/UiTextboxDto.ts';
import type {UiBarDto} from '@/helpers/ui/bar/UiBarDto.ts';
import {UiAnchor} from '@/helpers/ui/UiElemBuilder.ts';

export type DialogConf = {
    startMonolog: number, // индекс в monologues
    monologues: MonologConf[],
}

export class Dialog implements TimelineEvent {
    protected isStarted: boolean = false;
    protected conf: DialogConf;
    protected currentMonolog?: MonologConf;

    protected rootContainer?: UiContainerDto;
    protected textbox?: UiTextboxDto;
    protected buttonsContainer?: UiContainerDto;
    protected bar?: UiBarDto;

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
        //
    }

    public start(): this {
        this.currentMonolog = this.conf.monologues[this.conf.startMonolog];
        this.isStarted = true;

        EventBus.emit(Events.DialogStarted);


        this.textbox = ui().text(this.currentMonolog!.text).get();
        this.rootContainer = ui().box().at(UiAnchor.Bottom).with(
                ui()
                    .box()
                    .asCols()
                    .with(
                        // todo sprite
                        this.textbox,
                    )
            ).show();

        return this;
    }
}