import type {Engine, OnPreUpdate} from 'excalibur';
import {type EnemyWaveConf, EnemyWaveFactory} from '@/level/events/enemyWave/EnemeWaveFactory.ts';
import type {EnemyWave} from '@/level/events/enemyWave/EnemyWave.ts';
import type {DialogConf} from '@/level/events/dialog/Dialog.ts';
import {Dialog} from '@/level/events/dialog/Dialog.ts';

const TimelineEventType = {
    Wave: 'wave',
    Dialog: 'dialog',
} as const;

type TimelineEventWaveConf = {
    type: typeof TimelineEventType.Wave,
    conf: EnemyWaveConf,
}

type TimelineEventDialogConf = {
    type: typeof TimelineEventType.Dialog,
    conf: DialogConf,
}

export type TimelineEventConf = ({ delay?: number } | { time: number }) & (TimelineEventWaveConf | TimelineEventDialogConf);

type TimelineEvent = EnemyWave | Dialog;

export class Timeline implements OnPreUpdate {
    protected plannedEvents: {time: number, event: TimelineEvent}[] = [];
    protected currentEvents: TimelineEvent[] = [];
    protected time = 0;

    constructor() {}

    public buildPlan(conf: TimelineEventConf[]): this {
        let time = 0;

        this.plannedEvents = conf.map(eventConf => {
            if ('delay' in eventConf && eventConf.delay !== undefined) time += eventConf.delay;
            else if ('time' in eventConf) time = eventConf.time;

            switch (eventConf.type) {
                case TimelineEventType.Wave:
                    return {
                        time: time,
                        event: EnemyWaveFactory.create(eventConf.conf),
                    };
                case TimelineEventType.Dialog:
                    return {
                        time: time,
                        event: new Dialog(eventConf.conf),
                    };
            }
        }).sort((a, b) => a.time - b.time);

        return this;
    }

    public onPreUpdate(engine: Engine, elapsed: number): void {
        // 1) ищем событие, которое блокирует остальные (например, сюжетная вставка)
        const blockingEvent = this.currentEvents.find(e => e.blockTimeline());
        if (blockingEvent) {
            blockingEvent.onPreUpdate(engine, elapsed);
            return;
        }

        // 2) обновляем все события
        this.currentEvents.forEach(e => e.onPreUpdate(engine, elapsed));

        // 3) удаляем завершённые события
        this.currentEvents = this.currentEvents.filter(event => !event.isEnded());

        // 4) сохраняем прошедшее время
        this.time += elapsed;

        /**
         * 5) начинаем след. событие
         *
         *  начинаем не больше одного события в кадре. Для событий, которые должны начинаться одновременно, разница
         *  будет почти незаметной, а общая производительность улучшится
         */
        if (this.plannedEvents.length > 0 && this.plannedEvents[0]!.time <= this.time) {
            this.currentEvents.push(this.plannedEvents.shift()!.event.start());
        }
    }
}
