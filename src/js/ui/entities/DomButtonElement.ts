import {DomElement} from '@/ui/entities/abstract/DomElement.ts';
import {DomElementType, DomEvents} from '@/ui/components/DomComponent.ts';

export class DomButtonElement extends DomElement {
    public name = `DomButton#${this.id}`;

    public content: string = '';
    public focused: boolean = false;
    public padding: [number, number, number, number] = [0, 0, 0, 0];

    constructor() {
        super(DomElementType.Button);
        this.element.on(DomEvents.Focus, () => this.focused = true);
        this.element.on(DomEvents.Blur, () => this.focused = false);
    }

    /**
     * Установить внутренний html кнопки.
     * @param html
     */
    public setContent(html: string): this {
        this.content = html;
        return this;
    }

    /**
     * Установить внутренние отступы элемента.
     * @param padding
     * @protected
     */
    protected setPadding(...padding: number[]): this {
        padding[1] ??= padding[0]!;
        padding[2] ??= padding[0]!;
        padding[3] ??= padding[1];

        this.padding = padding as [number, number, number, number];
        return this;
    }

    /**
     * @inheritDoc
     */
    public setStyle(key: string, value: string|number|number[]): this {
        if (key.startsWith('padding')) {
            // padding обрабатываем как особый случай из-за костылей для border-image кнопки

            if (typeof value === 'string') {
                value = value.split(' ').map(p => Number(p.replace('px', '')));
            } else if (typeof value === 'number') {
                value = [value];
            }

            if (key.endsWith('-top')) value = [value[0]!, 0, 0, 0];
            else if (key.endsWith('-right')) value = [0 , value[0]!, 0, 0];
            else if (key.endsWith('-bottom')) value = [0, 0, value[0]!, 0];
            else if (key.endsWith('-left')) value = [0, 0, 0, value[0]!];

            return this.setPadding(...value);
        }

        return super.setStyle(key, value);
    }

    public clearStyle(key: string): this {
        if (key.startsWith('padding')) {
            // padding обрабатываем как особый случай из-за костылей для border-image кнопки

            let value = this.padding;

            if (key.endsWith('-top')) value = [0, value[1], value[2], value[3]];
            else if (key.endsWith('-right')) value = [value[0], 0, value[2], value[3]];
            else if (key.endsWith('-bottom')) value = [value[0], value[1], 0, value[3]];
            else if (key.endsWith('-left')) value = [value[0], value[1], value[2], 0];
            else value = [0, 0, 0, 0];

            return this.setPadding(...value);
        }

        return super.clearStyle(key);
    }

    public addChild(_: DomElement): this {
        throw new Error('Нельзя добавлять дочерние элементы в кнопку!');
        return this;
    }
}