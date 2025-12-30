import {EventEmitter} from 'excalibur';

export const Events = {
    DialogStarted: 'dialogStarted',
    DialogEnded: 'dialogEnded',
    UIButtonUnfocus: 'uiButtonUnfocus',
} as const;

export const EventBus = new EventEmitter<{
    [Events.DialogStarted]: {},
    [Events.DialogEnded]: {},
    [Events.UIButtonUnfocus]: {},
}>();
