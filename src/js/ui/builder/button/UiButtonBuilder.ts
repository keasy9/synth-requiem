import {UiElemBuilder} from '@/ui/builder/UiElemBuilder.ts';
import {UiButtonDto} from '@/ui/builder/button/UiButtonDto.ts';
import {type Reactive, reactive} from 'vue';

export class UiButtonBuilder extends UiElemBuilder {
    protected _content: string = '';
    protected _onclick?: Function;

    /**
     * Установить внутренний html.
     * @param html
     */
    public content(html: string): this {
        this._content = html;
        return this;
    }

    /**
     * Установить коллбэк.
     * @param callback
     */
    public onClick(callback: Function): this {
        this._onclick = callback;
        return this;
    }

    /**
     * @inheritDoc
     */
    public get(): Reactive<UiButtonDto> {
        const instance = reactive(new UiButtonDto());

        instance.anchor = this._anchor;
        instance.content = this._content;
        instance.onclick = this._onclick;

        return instance;
    }

    /**
     * @inheritDoc
     */
    public show(): Reactive<UiButtonDto> {
        const dto = this.get();

        dto.show();

        return dto;
    }
}