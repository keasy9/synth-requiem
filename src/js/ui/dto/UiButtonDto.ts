import {UiElemDto} from '@/ui/dto/UiElemDto.ts';

export class UiButtonDto extends UiElemDto {
    public content: string = '';
    public onclick?: Function;
    public padding: [number, number, number, number] = [1, 1, 1, 1];
    public focused: boolean = false;

    /**
     * Установить внутренний html.
     * @param html
     */
    public html(html: string): this {
        this.content = html;
        return this;
    }

    /**
     * Установить коллбэк по клику.
     * @param callback
     */
    public callback(callback: Function): this {
        this.onclick = callback;
        return this;
    }

    public focus(): this {
        this.focused = true;
        return this;
    }

    public click(): this {
        this.onclick ? this.onclick() : null;
        return this;
    }
}