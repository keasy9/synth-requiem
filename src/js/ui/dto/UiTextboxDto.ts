import {UiElemDto} from '@/ui/dto/UiElemDto.ts';

export class UiTextboxDto extends UiElemDto {
    public content: string = '';
    public typing: boolean = false;

    /**
     * Установить внутренний html.
     * @param html
     */
    public html(html: string): this {
        this.content = html;
        return this;
    }

    /**
     * Добавить html в конец уже установленного контента.
     * @param html
     */
    public append(html: string): this {
        this.content += html;
        return this;
    }

    /**
     * Добавить html в начало уже установленного контента.
     * @param html
     */
    public prepend(html: string): this {
        this.content = html + this.content;
        return this;
    }

    /**
     * Включить или выключить анимацию печати текста.
     * @param typing
     */
    public type(typing: boolean = true): this {
        this.typing = typing;
        return this;
    }
}