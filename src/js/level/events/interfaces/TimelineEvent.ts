import type {OnPreUpdate} from 'excalibur';

export interface TimelineEvent extends OnPreUpdate {
    start(): this;
    isEnded(): boolean;
    blockTimeline(): boolean;
}
