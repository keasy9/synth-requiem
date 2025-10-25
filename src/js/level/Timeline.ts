import {EnemyWave, type EnemyWaveConf} from '@/level/events/EnemyWave.ts';
import type {Engine, OnPreUpdate} from 'excalibur';

const TimelineEventType = {
    Wave: 'wave',
} as const;

type TimelineEventWaveConf = {
    type: typeof TimelineEventType.Wave,
    conf: EnemyWaveConf,
}

type TimelineEventConf = ({ delay: number } | { time: number }) & (TimelineEventWaveConf); // todo | OtherEventConf | OtherEventConf

type TimelineEvent = EnemyWave; // todo | OtherEventClass | OtherEventClass

export class Timeline implements OnPreUpdate {
    protected plannedEvents: {time: number, event: TimelineEvent}[] = [];
    protected currentEvents: TimelineEvent[] = [];

    constructor() {}

    public buildPlan(conf: TimelineEventConf[]): this {
        let time = 0;

        conf.forEach(eventConf => {
            if ('delay' in eventConf) time += eventConf.delay;
            else time = eventConf.time;

            switch (eventConf.type) {
                case TimelineEventType.Wave:
                    this.plannedEvents.push({
                        time: time,
                        event: new EnemyWave(eventConf.conf),
                    })
                    break;
            }
        });

        return this;
    }

    public onPreUpdate(_engine: Engine, _elapsed: number): void {
        // todo обновлять текущие события
        // todo проверять текущие события на завершение
        // todo проверять запланированные события на необходимость начала
        // todo разрешать событиям прерывать обновление следующих событий
    }
}
