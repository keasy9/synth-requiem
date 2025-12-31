import {ActionsComponent, type Engine, Entity} from 'excalibur';
import {DomComponent, DomPositionAnchor} from '@/components/DomComponent.ts';

export class DomElement extends Entity<DomComponent | ActionsComponent> {
    public name = `DomEl#${this.id}`;

    public get element(): DomComponent {
        return this.get(DomComponent);
    }

    public get actions(): ActionsComponent {
        return this.get(ActionsComponent);
    }

    constructor() {
        super([new DomComponent(), new ActionsComponent()]);
    }

    /**
     * @inheritDoc
     */
    public _initialize(engine: Engine) {
        super._initialize(engine);
        for (const child of this.children) {
            child._initialize(engine);
        }
    }

    /**
     * Установить позицию элемента. Учитывается только у абсолютно-позиционированных элементов (без родителя).
     * @param anchor
     */
    public at(anchor: typeof DomPositionAnchor[keyof typeof DomPositionAnchor]): this {
        this.element.anchor = anchor;
        return this;
    }

    // todo разное поведение в зависимости от типа элемента или отдельные классы
}