import type {OnInitialize, OnPreUpdate} from 'excalibur';

export interface TimelineEvent extends OnPreUpdate, OnInitialize {
    start(): this;
    isEnded(): boolean;
    blockTimeline(): boolean;
}
