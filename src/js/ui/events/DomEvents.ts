import {GameEvent} from 'excalibur';
import type {DomComponent} from '@/ui/components/DomComponent.ts';

abstract class DomEvent extends GameEvent<HTMLElement> {
    element?: HTMLElement;
    self: DomComponent;
    originalEvent?: Event;

    constructor(self: DomComponent, element?: HTMLElement, originalEvent?: Event) {
        super();
        this.element = element;
        this.self = self;
        this.originalEvent = originalEvent;
    }
}

export class DomFocusEvent extends DomEvent {
    declare originalEvent?: FocusEvent;
}

export class DomBlurEvent extends DomEvent { }

export class DomClickEvent extends DomEvent {
    declare originalEvent?: PointerEvent;
}

export class DomMouseEnterEvent extends DomEvent {
    declare originalEvent?: MouseEvent;
}

export class DomMouseLeaveEvent extends DomEvent {
    declare originalEvent?: MouseEvent;
}
