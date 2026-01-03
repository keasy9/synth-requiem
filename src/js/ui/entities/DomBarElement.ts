import {DomElement, type DomElementDto, DomPositionAnchor} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType} from '@/ui/components/DomComponent.ts';
import {Color, Engine, type EntityEvents, type EventKey, GameEvent, type Handler, type Subscription, Timer} from 'excalibur';
import {UiColor} from '@/ui/Ui.ts';
import {GAME} from '@/main.ts';
import {type Reactive, reactive} from 'vue';

export class TimerTimoutEvent<T> extends GameEvent<T> {
    engine: Engine;
    self: T;
    constructor(engine: Engine, self: T) {
        super();
        this.engine = engine;
        this.self = self;
    }
}

export interface DomBarEvents extends EntityEvents {
    timertimout: TimerTimoutEvent<DomBarElement>;
}

export interface DomBarDto extends DomElementDto {
    type: typeof DomElementType.Bar;
    color?: string;
    progress?: number;
    height?: number;
}

export class DomBarElement extends DomElement {
    public name = `DomBar#${this.id}`;

    protected _dto: Reactive<DomBarDto> = reactive({
        type: DomElementType.Bar,
        anchor: DomPositionAnchor.Center,
        id: this.id,
        color: UiColor.Accent.toHex(),
    });
    protected _colors: Record<number, Color> = {100: UiColor.Accent};
    protected _timer?: Timer;

    constructor() {
        super(DomElementType.Bar);
    }

    /**
     * Установить цвета прогресбара.
     * @param colors
     */
    public setColors(colors: Record<number, Color>): this {
        this._colors = colors;
        return this;
    }

    /**
     * Установить цвет прогресбара и точку прогресса, в которой нужно включить этот цвет.
     * @param progress
     * @param color
     */
    public setColor(progress: number, color: Color): this {
        this._colors[progress] = color;
        this.computeColor();
        return this;
    }

    /**
     * Установить прогресс прогрссбара.
     * Если у прогресбара есть таймер (установлено время), то установленный вручную прогресс будет затёрт в следующем кадре.
     * @param progress
     * @param silent
     */
    public setProgress(progress: number, silent: boolean = false): this {
        this._dto.progress = progress;

        this._dto.color = this.computeColor().toHex();

        if (progress <= 0 && !silent) {
            this.emit('timertimout', new TimerTimoutEvent<DomBarElement>(GAME, this));
        }

        return this;
    }

    /**
     * Установить время прогресбара. Создаёт таймер, синхронизирует прогресс таймера и прогрессбара.
     * @param time
     * @param action
     */
    public initTimer(time: number, action?: Handler<DomBarEvents['timertimout']>): this {
        if (!this._timer) {
            this._timer = new Timer({
                interval: time,
                action: () => this.setProgress(0),
            });

            GAME.add(this._timer);
        } else {
            this._timer.interval = time;
        }

        if (action) this.once('timertimout', action);

        return this;
    }

    /**
     * Запустить прогресбар. Сработает только если установлено время.
     */
    public start(): this {
        this.getTimerOrFail().start();
        return this;
    }

    /**
     * Поставить на паузу. Сработает только если установлено время.
     */
    public pause(): this {
        this.getTimerOrFail().pause();
        return this;
    }

    /**
     * Остановить прогресбар. Сработает только если установлено время.
     */
    public stop(): this {
        this.getTimerOrFail().stop();
        return this;
    }

    /**
     * Сбросить таймер прогресбара. Можно указать новое время.
     * @param time
     */
    public reset(time?: number): this {
        if (time && !this._timer) return this.initTimer(time);

        this.getTimerOrFail().reset(time);
        return this;
    }

    /**
     * Установить высоту прогрессбара в пикселях.
     * @param height
     */
    public setHeight(height: number): this {
        this._dto.height = height;
        return this;
    }

    /**
     * Если таймера нет, выбросит ошибку. Если таймер есть, вернёт его.
     * @protected
     */
    protected getTimerOrFail(): Timer {
        if (!this._timer) throw new Error('Сначала нужно указать время!');
        return this._timer;
    }

    public addChild(_: DomElement): this {
        throw new Error('Нельзя добавлять дочерние элементы в прогрессбар!');
        return this;
    }

    /**
     * @inheritDoc
     */
    public onPostUpdate(_engine: Engine, _elapsed: number) {
        if (this._timer?.isRunning) this.setProgress(this._timer.timeToNextAction / this._timer.interval * 100);
    }

    public emit<TEventName extends EventKey<DomBarEvents>>(eventName: TEventName, event?: DomBarEvents[TEventName]): void {
        super.emit(eventName, event);
    }

    public on<TEventName extends EventKey<DomBarEvents>>(eventName: TEventName, handler: Handler<DomBarEvents[TEventName]>): Subscription {
        return super.on(eventName, handler);
    }

    public once<TEventName extends EventKey<DomBarEvents>>(eventName: TEventName, handler: Handler<DomBarEvents[TEventName]>): Subscription {
        return super.once(eventName, handler);
    }

    public off<TEventName extends EventKey<DomBarEvents>>(eventName: TEventName, handler?: Handler<DomBarEvents[TEventName]>): void {
        //@ts-ignore
        super.off(eventName, handler);
    }

    protected computeColor(): Color {
        // если цвет один, то его и возвращаем
        const colors = Object.entries(this._colors);
        if (colors.length === 1) return colors[0]![1];

        const currentProgress = this._dto.progress ?? 100;

        let prevColor: Color;
        let nextColor: Color = colors[0]![1];

        let prevProgress: number;
        let nextProgress: number;

        // числовые ключи в объекте сортируются в порядке возрастания автоматически
        for (const progress in this._colors) {
            const color = this._colors[progress]!;
            if (progress > currentProgress) {
                prevColor = color;
                prevProgress = progress;
                break;
            }

            nextProgress = progress;
            nextColor = color;
        }

        if (!prevColor || prevColor.toHex() === nextColor.toHex()) return nextColor;

        const delta = (currentProgress - prevProgress) / (nextProgress - prevProgress);

        return new Color(
            prevColor.r + delta * (nextColor.r - prevColor.r),
            prevColor.g + delta * (nextColor.g - prevColor.g),
            prevColor.b + delta * (nextColor.b - prevColor.b),
            prevColor.a + delta * (nextColor.a - prevColor.a),
        );
    }
}
