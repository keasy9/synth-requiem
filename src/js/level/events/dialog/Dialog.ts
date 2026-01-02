import type {TimelineEvent} from '@/level/events/interfaces/TimelineEvent.ts';
import {type Engine, type Sprite, Timer} from 'excalibur';
import {EventBus, Events} from '@/helpers/events/EventBus.ts';
import {UiColor} from '@/ui/Ui.ts';
import type {EnumValue} from '@/utils/types.ts';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import {type Reactive} from 'vue';
import {GAME} from '@/main.ts';
import {DomContainerElement} from '@/ui/entities/DomContainerElement.ts';
import {DomTextboxElement} from '@/ui/entities/DomTextboxElement.ts';
import {DomButtonElement} from '@/ui/entities/DomButtonElement.ts';
import {DomBarElement} from '@/ui/entities/DomBarElement.ts';
import {DomSpriteElement} from '@/ui/entities/DomSpriteElement.ts';
import {UiDtoState, UiElementsState} from '@/ui/State.ts';
import {DomEvents} from '@/ui/components/DomComponent.ts';
import {DomPositionAnchor} from '@/ui/entities/abstract/DomElement.ts';

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
    text: string, // todo локализация?
    answers?: MonologAnswer[],
    nextMonolog?: number, // индекс в monologues родительского диалога
    time?: number,
}

export type DialogConf = {
    startMonolog: number, // индекс в monologues
    monologues: MonologConf[],
}

export class Dialog extends DomContainerElement implements TimelineEvent {
    protected static npcPortraits: Partial<Record<AnyNpcPortrait, Sprite>> = {};

    protected isStarted: boolean = false;
    protected conf: DialogConf;
    protected currentMonolog?: MonologConf;

    protected textEl?: Reactive<DomTextboxElement>;
    protected nameEl?: Reactive<DomTextboxElement>;
    protected buttonsEl?: Reactive<DomContainerElement<DomButtonElement>>;
    protected barEl?: Reactive<DomBarElement>;
    protected portraitEl?: Reactive<DomSpriteElement>;

    public constructor(conf: DialogConf) {
        super();
        this.conf = conf;
    }

    public blockTimeline(): boolean {
        return this.isStarted;
    }

    public isEnded(): boolean {
        return this.currentMonolog !== undefined;
    }

    public start(): this {
        this.isStarted = true;

        EventBus.emit(Events.DialogStarted);

        GAME.add(this);

        return this;
    }

    public onInitialize(engine: Engine) {
        super.onInitialize(engine);

        this.setMonolog(this.conf.monologues[this.conf.startMonolog]!);

        this.setAnchor(DomPositionAnchor.Bottom)
            .setStyle('gap', 4)
            .setStyle('padding', 10)
            .setStyle('grid-template-columns', 'auto 1fr')
            .setColsLayout()
            .addChildren(
                this.portraitEl!,
                new DomContainerElement()
                    .setRowsLayout()
                    .setStyle('padding-top', 19)
                    .addChildren(
                        this.nameEl!,
                        this.barEl!,
                        this.textEl!,
                        this.buttonsEl!,
                    ),
            );
    }

    protected setMonolog(conf: MonologConf): void {
        this.currentMonolog = conf;

        this.setNpc(conf.npc);
        this.setText(conf.text);
        this.setName(conf.name);
        this.setAnswers(conf.answers ?? []);
        this.resetBar(conf.time);
    }

    protected setText(text: string): void {
        this.textEl ??= new DomTextboxElement()
            .setStyle('margin', [0, 0, 10, -40])
            .setStyle('padding', [3, 3, 3, 40])
            .setStyle('border-top', `1px solid ${UiColor.Primary.toHex()}`);

        this.textEl.animateTyping(40, text, this.onTextTyped.bind(this));
    }

    protected setNpc(npc: AnyNpcPortrait): void {
        Dialog.npcPortraits[npc] ??= sprite(Resources.SpriteCharacter)
            .autoHeight(1)
            .autoWidth(1)
            .one();

        this.portraitEl ??= new DomSpriteElement();

        this.portraitEl.framesFrom(Dialog.npcPortraits[npc]!).setScale(1.5) // для лучшего визуала;
    }

    protected setName(name: string): void {
        this.nameEl = new DomTextboxElement()
            .setStyle('margin-left', -40)
            .setStyle('padding', [3, 8, 6, 40])
            .setStyle('border-top', `1px solid ${UiColor.Primary.toHex()}`);

        this.nameEl.setContent(name)
    }

    protected setAnswers(answers: MonologAnswer[]): void {
        this.buttonsEl ??= new DomContainerElement<DomButtonElement>().setStyle('gap', 3);

        this.buttonsEl.addChildren(...answers.map(answer => {
            const btn = new DomButtonElement().setContent(answer.text);

            let cb;

            if ((typeof answer.nextMonolog === 'number') && (answer.nextMonolog in this.conf.monologues)) {
                cb = () => this.setMonolog(this.conf.monologues[answer.nextMonolog!]!);

            } else {
                cb = this.end.bind(this);
            }

            btn.on(DomEvents.Click, () => {
                // 1) блокируем взаимодействие с диалогом
                this.setStyle('pointer-events', 'none');

                // 2) останавливаем таймер на выбор ответа и анимацию печати текста
                this.textEl?.stopAnimation();
                this.barEl?.pause();

                // 3) запускаем таймер моргания кнопки
                let visible = true;
                const blinkTimer = new Timer({
                    interval: 80,
                    action: () => {
                        visible = !visible;
                        btn.setStyle('visibility', visible ? 'visible' : 'hidden');
                    },
                    repeats: true,
                    numberOfRepeats: 7,
                });

                GAME.add(blinkTimer);
                blinkTimer.start();

                // 4) запускаем таймер реакции на нажатие
                const reactTimer = new Timer({
                    interval: 560,
                    action: () => {
                        cb();
                        this.clearStyle('pointer-events');
                    },
                });

                GAME.add(reactTimer);
                reactTimer.start();
            });

            return btn;
        }));
    }

    protected resetBar(time?: number): void {
        this.barEl ??= new DomBarElement()
            .setColor(20, UiColor.Danger)
            .setStyle('margin-left', -40);

        if (time) {
            this.barEl
                .initTimer(time, () => (
                    this.buttonsEl?.children.find(btn => btn.focused)
                    ?? this.buttonsEl?.children[0]
                )?.element.emit(DomEvents.Click))
                .setProgress(100)
                .setStyle('visibility', 'visible');
        } else {
            this.barEl.setStyle('visibility', 'hidden');
        }
    }

    public onTextTyped(): void {
        this.barEl?.start();
    }

    protected end(): void {
        delete UiDtoState[this.id];
        delete UiElementsState[this.id];

        this.isStarted = false;
        delete this.currentMonolog;
        EventBus.emit(Events.DialogEnded);
    }
}