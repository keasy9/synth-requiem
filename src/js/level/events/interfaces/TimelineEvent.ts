import type {OnPreUpdate} from 'excalibur';

export interface TimelineEvent extends OnPreUpdate {
    isEnded(): boolean;
    blockTimeline(): boolean;
}
