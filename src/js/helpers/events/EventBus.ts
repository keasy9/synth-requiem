import {EventEmitter} from 'excalibur';

export const Events = {
    DialogStarted: 'dialogStarted',
    DialogEnded: 'dialogEnded',
} as const;

export const EventBus = new EventEmitter<{
    [Events.DialogStarted]: {},
    [Events.DialogEnded]: {},
}>();