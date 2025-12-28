import {UiElemDto} from '@/ui/dto/UiElemDto.ts';

export class UiButtonDto extends UiElemDto {
    public content: string = '';
    public onclick?: Function;

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
}