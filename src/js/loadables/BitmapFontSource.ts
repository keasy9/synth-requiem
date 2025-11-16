import {Future, ImageSource, type Loadable, Resource} from 'excalibur';
import {BitmapFont} from '@/helpers/graphics/BitmapFont.ts';

type FntData = {
    info: {
        face?: string,
        size?: number,
        bold?: number,
        italic?: number,
    },
    common: {
        lineHeight?: number,
        base?: number,
        scaleW?: number,
        scaleH?: number,
        pages?: number,
    },
    chars: Record<number, {
        id: number,
        x: number,
        y: number,
        width: number,
        height: number,
        xoffset: number,
        yoffset: number,
        xadvance: number,
        page: number,
        chnl: number,
    }>,
    kernings: Record<number, Record<number, number>>,
    pages: {
        id: number,
        file: string,
    }[],
}

type BitmapFontSourceData = Omit<FntData, 'pages'> & {
    bitmap: Resource<string>,
    pages: Record<number, ImageSource>,
}

/**
 * Bitmap-шрифт. Загружает .fnt-файл в текстовом формате, ищет по тому же пути все файлы, указанные в .fnt как страницы (page) и загружает их.
 */
export class BitmapFontSource implements Loadable<BitmapFontSourceData> {
    public readonly path: string;
    protected _readyFuture = new Future<BitmapFontSourceData>();
    /**
     * Промис, который будет разрешён после загрузки ресурса. Не инициирует загрузку
     */
    public ready: Promise<BitmapFontSourceData> = this._readyFuture.promise;
    public data: BitmapFontSourceData;

    public constructor(path: string, bustCache: boolean = false) {
        this.path = path;
        this.data = {
            info: {},
            common: {},
            chars: {},
            kernings: {},
            bitmap: new Resource(this.path, 'text', bustCache),
            pages: [],
        };
    }

    /**
     * Загружен ли ресурс
     */
    public isLoaded(): boolean {
        return !!Object.keys(this.data.pages).length;
    }

    /**
     * Нужно ли добавлять в адрес запроса параметр для кэширования? По умолчанию false.
     * Должно быть определено до начала загрузки
     */
    public get bustCache() {
        return this.data.bitmap.bustCache;
    }

    public set bustCache(val: boolean) {
        this.data.bitmap.bustCache = val;
        for (let [_id, page] of Object.entries(this.data.pages)) {
            page.bustCache = val;
        }
    }

    /**
     * Парсит контент .fnt-файла.
     * @param fntData
     * @protected
     */
    protected parseFnt(fntData: string) {
        const config: FntData = {
            common: {},
            chars: {},
            kernings: {},
            info: {},
            pages: [],
        };

        fntData.split('\n').forEach(line => {
            line = line.trim();
            if (!line) return;

            const parts = line.split(' ');
            const type = parts[0];

            switch (type) {
                case 'info':
                    this.parseInfo(parts, config.info);
                    break;
                case 'common':
                    this.parseCommon(parts, config.common);
                    break;
                case 'page':
                    this.parsePage(parts, config.pages);
                    break;
                case 'char':
                    this.parseChar(parts, config.chars);
                    break;
                case 'kerning':
                    this.parseKerning(parts, config.kernings);
                    break;
            }
        });

        return config;
    }

    /**
     * Парсит информацию о шрифте.
     * @protected
     */
    protected parseInfo(parts: string[], info: FntData['info']) {
        const data = this.parseKeyValue(parts);
        if (!data.size) throw `Ошибка загрузки bitmap-шрифта [${this.path}]: отсутствует info.size`

        info.face = data.face;
        info.size = parseInt(data.size);
        info.bold = data.bold ? parseInt(data.bold) : 0;
        info.italic = data.italic ? parseInt(data.italic) : 0;
    }

    /**
     * Парсит общие параметры шрифта.
     * @protected
     */
    protected parseCommon(parts: string[], common: FntData['common']) {
        const data = this.parseKeyValue(parts);
        common.lineHeight = data.lineHeight ? parseInt(data.lineHeight) : 0;
        common.base = data.base ? parseInt(data.base) : 0;
        common.scaleW = data.scaleW ? parseInt(data.scaleW) : 0;
        common.scaleH = data.scaleH ? parseInt(data.scaleH) : 0;
        common.pages = data.pages ? parseInt(data.pages) : 1;
    }

    /**
     * Парсит информацию о страницах текстуры.
     * @protected
     */
    protected parsePage(parts: string[], pages: FntData['pages']) {
        const data = this.parseKeyValue(parts);
        if (data.id && data.file) {
            pages.push({
                id: parseInt(data.id),
                file: data.file.replace(/["']/g, ''), // удаляем кавычки
            });
        }
    }

    /**
     * Парсит данные о символе.
     * @protected
     */
    protected parseChar(parts: string[], chars: FntData['chars']) {
        const data = this.parseKeyValue(parts);
        if (!data.id || !data.width || !data.height || !data.page) return

        const charId = parseInt(data.id);

        chars[charId] = {
            id: charId,
            x: data.x ? parseInt(data.x) : 0,
            y: data.y ? parseInt(data.y) : 0,
            width: parseInt(data.width),
            height: parseInt(data.height),
            xoffset: data.xoffset ? parseInt(data.xoffset) : 0,
            yoffset: data.yoffset ? parseInt(data.yoffset) : 0,
            xadvance: data.xadvance ? parseInt(data.xadvance) : 0,
            page: data.page ? parseInt(data.page) : 0,
            chnl: data.chnl ? parseInt(data.chnl) : 15,
        };
    }

    /**
     * Парсит кернинг (расстояние между парами символов).
     * @protected
     */
    protected parseKerning(parts: string[], kernings: FntData['kernings']) {
        const data = this.parseKeyValue(parts);
        if (!data.first || !data.second || !data.amount) return;

        const first = parseInt(data.first);
        const second = parseInt(data.second);

        if (!kernings[first]) {
            kernings[first] = {};
        }
        kernings[first][second] = parseInt(data.amount);
    }

    /**
     * Вспомогательный метод для парсинга ключ=значение.
     * @protected
     */
    protected parseKeyValue(parts: string[]): Record<string, string> {
        const result: Record<string, string> = {};

        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key && value !== undefined) result[key] = value;
        });

        return result;
    }


    /**
     * Загрузить ресурс
     */
    public async load(): Promise<BitmapFontSourceData> {
        if (this.isLoaded()) {
            return this.data;
        }

        try {
            await this.data.bitmap.load();
            const data = this.parseFnt(this.data.bitmap.data);
            const dirName = this.path.split('/').slice(0, -1).join('/');

            for (const page of data.pages) {
                const img = new ImageSource(dirName + '/' + page.file, this.bustCache);
                this.data.pages[page.id] = img;
                await img.load();
            }

            this.data.info = data.info;
            this.data.common = data.common;
            this.data.chars = data.chars;
            this.data.kernings = data.kernings;

        } catch (error: any) {
            throw `Ошибка загрузки BitmapFontSource по адресу [${this.path}]': ${error.message}`;
        }

        this._readyFuture.resolve(this.data);
        return this.data;
    }

    /**
     * Преобразовать в bitmap-шрифт
     */
    public toFont(): BitmapFont {
        return BitmapFont.from(this);
    }

    /**
     * Выгрузить из памяти
     */
    public unload(): void {
        this.data = {
            info: {},
            common: {},
            chars: {},
            kernings: {},
            bitmap: new Resource(this.path, 'text', this.bustCache),
            pages: [],
        };
    }
}