import {UiElemBuilder} from '@/helpers/ui/UiElemBuilder.ts';
import {UiTextboxDto} from '@/helpers/ui/textbox/UiTextboxDto.ts';
import {type Reactive, reactive} from 'vue';

export class UiTextboxBuilder extends UiElemBuilder {
    protected _content: string = '';

    /**
     * Установить внутренний html.
     * @param html
     */
    public content(html: string): this {
        this._content = html;
        return this;
    }

    /**
     * Добавить html в конец уже установленного контента.
     * @param html
     */
    public append(html: string): this {
        this._content += html;
        return this;
    }

    /**
     * Добавить html в начало уже установленного контента.
     * @param html
     */
    public prepend(html: string): this {
        this._content = html + this._content;
        return this;
    }

    /**
     * @inheritDoc
     */
    public get(): Reactive<UiTextboxDto> {
        const instance = reactive(new UiTextboxDto());

        instance.content = this._content;
        instance.anchor = this._anchor;

        return instance;
    }


    /**
     * @inheritDoc
     */
    public show(): Reactive<UiTextboxDto> {
        const dto = this.get();

        dto.show();

        return dto;
    }
}