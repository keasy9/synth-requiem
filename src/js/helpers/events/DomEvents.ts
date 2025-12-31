import {GameEvent} from 'excalibur/build/dist/Events';
import {PointerEvent} from 'excalibur';
import type {DomComponent} from '@/components/DomComponent.ts';

abstract class DomEvent extends GameEvent<HTMLElement> {
    element?: HTMLElement;
    self: DomComponent;
    originalEvent?: Event;

    constructor(element?: HTMLElement, self: DomComponent, originalEvent?: Event) {
        this.element = element;
        this.self = self;
        this.originalEvent = originalEvent;
    }
}

export class DomFocusEvent extends DomEvent {
    originalEvent?: FocusEvent;
}

export class DomBlurEvent extends DomEvent { }

export class DomClickEvent extends DomEvent {
    originalEvent?: PointerEvent;
}

export class DomMouseEnterEvent extends DomEvent {
    originalEvent?: MouseEvent;
}

export class DomMouseLeaveEvent extends DomEvent {
    originalEvent?: MouseEvent;
}
