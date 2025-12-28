import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import {type Engine, type Sprite} from 'excalibur';
import {EventBus, Events} from '@/helpers/events/EventBus.ts';
import type {UiContainerDto} from '@/ui/dto/UiContainerDto.ts';
import {ui} from '@/ui/Ui.ts';
import type {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
import type {UiBarDto} from '@/ui/dto/UiBarDto.ts';
import {UiAnchor} from '@/ui/dto/UiElemDto.ts';
import type {EnumValue} from '@/utils/types.ts';
import type {UiSpriteDto} from '@/ui/dto/UiSpriteDto.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import type {Reactive} from 'vue';

const NpcPortrait = {
    Test: 'test',
} as const;

type AnyNpcPortrait = EnumValue<typeof NpcPortrait>;

type MonologAnswer = {
    text: string,
    nextMonolog?: number, // индекс в monologues родительского диалога
}

export type MonologConf = {
    npc: AnyNpcPortrait,
    name: string,
    text: string, // todo локализация, и цветные вставки как в katana zero
    answers?: MonologAnswer[],
    nextMonolog?: number, // индекс в monologues родительского диалога
    time?: number,
}

export type DialogConf = {
    startMonolog: number, // индекс в monologues
    monologues: MonologConf[],
}

export class Dialog implements TimelineEvent {
    protected static npcPortraits: Partial<Record<AnyNpcPortrait, Sprite>> = {};

    protected isStarted: boolean = false;
    protected conf: DialogConf;
    protected currentMonolog?: MonologConf;

    protected rootContainer?: Reactive<UiContainerDto>;
    protected textbox?: Reactive<UiTextboxDto>;
    protected name?: Reactive<UiTextboxDto>;
    protected buttonsContainer?: Reactive<UiContainerDto>;
    protected bar?: Reactive<UiBarDto>;
    protected npcPortrait?: Reactive<UiSpriteDto>;

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
        this.isStarted = true;
        this.setMonolog(this.conf.monologues[this.conf.startMonolog]!);

        EventBus.emit(Events.DialogStarted);

        return this;
    }

    protected setMonolog(conf: MonologConf): void {
        this.setText(conf.text);
        this.setNpc(conf.npc);
        this.setName(conf.name);
        this.setAnswers(conf.answers ?? []);

        this.rootContainer ??= ui()
            .box()
            .at(UiAnchor.Bottom)
            .withGap(4)
            .withPadding(10)
            .asCols()
            .with(
                this.npcPortrait!,
                ui()
                    .box()
                    .asRows()
                    .grow()
                    .with(
                        this.name!,
                        this.textbox!,
                        this.buttonsContainer!,
                    ),
            ).reactive();

        this.rootContainer.show();
    }

    protected setText(text: string): void {
        if (!this.textbox) this.textbox = ui().text(text).type().reactive();
        else this.textbox.content = text;
    }

    protected setNpc(npc: AnyNpcPortrait): void {
        Dialog.npcPortraits[npc] ??= sprite(Resources.SpriteCharacter)
            .autoHeight(1)
            .autoWidth(1)
            .one();

        if (!this.npcPortrait) {
            this.npcPortrait = ui()
                .sprite(Dialog.npcPortraits[npc])
                .scaleBy(1.5) // для лучшего визуала
                .reactive();
        } else {
            this.npcPortrait.framesFrom(Dialog.npcPortraits[npc]!);
        }
    }

    protected setName(name: string): void {
        if (!this.name) this.name = ui().text(name).reactive();
        else this.name.content = name;
    }

    protected setAnswers(answers: MonologAnswer[]): void {
        this.buttonsContainer ??= ui().box().withGap(1).reactive();

        this.buttonsContainer.children = answers.map(answer => {
            const btn = ui().button().html(answer.text);

            if ((typeof answer.nextMonolog === 'number') && (answer.nextMonolog in this.conf.monologues)) {
                btn.callback(() => this.setMonolog(this.conf.monologues[answer.nextMonolog!]!));

            } else {
                btn.callback(this.end.bind(this));
            }

            return btn.reactive();
        });
    }

    protected end(): void {
        this.rootContainer?.hide();
        this.isStarted = false;
        delete this.currentMonolog;
        EventBus.emit(Events.DialogEnded);
    }
}