import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import {type Engine, type Sprite, Timer} from 'excalibur';
import {EventBus, Events} from '@/helpers/events/EventBus.ts';
import type {UiContainerDto} from '@/ui/dto/UiContainerDto.ts';
import {ui, UiColor} from '@/ui/Ui.ts';
import type {UiTextboxDto} from '@/ui/dto/UiTextboxDto.ts';
import type {UiBarDto} from '@/ui/dto/UiBarDto.ts';
import {UiAnchor} from '@/ui/dto/UiElemDto.ts';
import type {EnumValue} from '@/utils/types.ts';
import type {UiSpriteDto} from '@/ui/dto/UiSpriteDto.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import type {Reactive} from 'vue';
import {GAME} from '@/main.ts';

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
    text: string, // todo локализация и цветные вставки как в katana zero
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

    protected barTimer?: Timer;

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
        if (this.barTimer && this.bar) {
            this.bar?.setProgress(this.barTimer.timeToNextAction / this.barTimer.interval * 100);
        }
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
        this.resetBar(conf.time);

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
                    .withPadding(19, 0, 0, 0)
                    .with(
                        this.name!,
                        this.bar!,
                        this.textbox!,
                        this.buttonsContainer!,
                    ),
            )
            .reactive();

        this.rootContainer.addToRoot();
    }

    protected setText(text: string): void {
        // todo перетащить функционал анимации появления текста сюда из vue, и сделать чтобы таймер запускался только после полного появления текста
        if (!this.textbox) {
            this.textbox = ui().text(text)
                .grow()
                .type()
                .withMargin(0, 0, 10, -40)
                .withPadding(3, 3, 3, 40)
                .border(1, 0, 0, 0, UiColor.Primary)
                .reactive();

        } else {
            this.textbox.content = text;
        }
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
        if (!this.name) {
            this.name = ui()
                .text(name)
                .withMargin(0, 0, 0, -40)
                .withPadding(3, 8, 6, 40)
                .border(1, 0, 0, 0, UiColor.Primary)
                .reactive();

        } else {
            this.name.content = name;
        }
    }

    protected setAnswers(answers: MonologAnswer[]): void {
        this.buttonsContainer ??= ui().box().withGap(3).reactive();

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

    protected resetBar(time?: number): void {
        if (time) {
            if (!this.bar) {
                this.bar = ui().bar()
                    .paintAt(20, UiColor.Danger)
                    .withMargin(0, 0, 0, -40)
                    .reactive();
            } else {
                this.bar.setProgress(100);
            }

            if (!this.barTimer) {
                this.barTimer = new Timer({interval: time});
                GAME.add(this.barTimer);
            } else {
                this.barTimer.reset(time);
            }

            this.barTimer.start();

        } else {
            this.bar?.hide();
        }
    }

    protected end(): void {
        this.rootContainer?.hide();
        this.isStarted = false;
        delete this.currentMonolog;
        EventBus.emit(Events.DialogEnded);
    }
}