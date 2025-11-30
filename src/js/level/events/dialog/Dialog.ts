import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import {type Animation, AnimationStrategy, type Engine} from 'excalibur';
import {EventBus, Events} from '@/helpers/events/EventBus.ts';
import type {UiContainerDto} from '@/ui/builder/container/UiContainerDto.ts';
import {ui} from '@/ui/builder/Ui.ts';
import type {UiTextboxDto} from '@/ui/builder/textbox/UiTextboxDto.ts';
import type {UiBarDto} from '@/ui/builder/bar/UiBarDto.ts';
import {UiAnchor} from '@/ui/builder/UiElemBuilder.ts';
import type {EnumValue} from '@/utils/types.ts';
import type {UiSpriteDto} from '@/ui/builder/sprite/UiSpriteDto.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import type {Reactive} from 'vue';

const NpcPortrait = {
    General: 'general',
    Astronaut: 'astronaut',
    Soldier: 'soldier',
    Glorp: 'glorp',
    Engineer: 'engineer',
    Snail: 'snail',
    Deer: 'deer',
    Emoji: 'emoji',
    Girl: 'girl',
    Ant: 'ant',
    Noice: 'noice',
} as const;

type AnyNpcPortrait = EnumValue<typeof NpcPortrait>;

const NpcPortraitTypeToSpriteRow = {
    [NpcPortrait.General]: 0,
    [NpcPortrait.Astronaut]: 1,
    [NpcPortrait.Soldier]: 2,
    [NpcPortrait.Glorp]: 3,
    [NpcPortrait.Engineer]: 4,
    [NpcPortrait.Snail]: 5,
    [NpcPortrait.Deer]: 6,
    [NpcPortrait.Emoji]: 7,
    [NpcPortrait.Girl]: 8,
    [NpcPortrait.Ant]: 9,
    [NpcPortrait.Noice]: 10,
} as const;

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
    protected static npcPortraits: Partial<Record<AnyNpcPortrait, Animation>> = {};

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
            .gap(2)
            .with(
                ui()
                    .box()
                    .asCols()
                    .with(
                        ui().box().asRows().with(
                            this.npcPortrait!,
                            this.name!,
                        ),
                        this.textbox!,
                    ),
                this.buttonsContainer!,
            ).get();

        this.rootContainer.show();
    }

    protected setText(text: string): void {
        if (!this.textbox) this.textbox = ui().text(text).type().get();
        else this.textbox.content = text;
    }

    protected setNpc(npc: AnyNpcPortrait): void {
        Dialog.npcPortraits[npc] ??= sprite(Resources.SpriteCharacters)
            .autoRows(8)
            .autoCols(8)
            .row(NpcPortraitTypeToSpriteRow[npc])
            .anim(AnimationStrategy.PingPong, 300);

        if (!this.npcPortrait) this.npcPortrait = ui().sprite(Dialog.npcPortraits[npc]).scale(2).get();
        else this.npcPortrait.setFramesFrom(Dialog.npcPortraits[npc]!);
    }

    protected setName(name: string): void {
        if (!this.name) this.name = ui().text(name).get();
        else this.name.content = name;
    }

    protected setAnswers(answers: MonologAnswer[]): void {
        this.buttonsContainer ??= ui().box().gap(1).get();

        this.buttonsContainer.children = answers.map(answer => {
            const btn = ui().button().content(answer.text);

            if ((typeof answer.nextMonolog === 'number') && (answer.nextMonolog in this.conf.monologues)) {
                btn.onClick(() => this.setMonolog(this.conf.monologues[answer.nextMonolog!]!));

            } else {
                btn.onClick(this.end.bind(this));
            }

            return btn.get();
        });
    }

    protected end(): void {
        this.rootContainer?.hide();
        this.isStarted = false;
        delete this.currentMonolog;
        EventBus.emit(Events.DialogEnded);
    }
}