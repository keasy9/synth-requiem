import {
    Animation,
    AnimationStrategy,
    type ImageSource,
    range,
    type SourceView,
    Sprite,
    SpriteFont,
    SpriteSheet,
} from 'excalibur';

class SpriteBuilder {
    protected _image?: ImageSource;
    protected _rows?: number = 1;
    protected _cols?: number = 1;
    protected _width?: number;
    protected _height?: number;
    protected _colSpan: number = 0;
    protected _rowSpan: number = 0;
    protected _offsetLeft: number = 0;
    protected _offsetTop: number = 0;
    protected _frames: SourceView[] = [];
    protected _from: number = 0;
    protected _to?: number;
    protected _indexes: number[] = [];
    protected _row?: number;

    public constructor() {}

    /**
     * Сбросить параметры до дефолтных.
     * С ними результатом будет один кадр, который полностью копирует исходное изображение.
     */
    public setDefaults(): this {
        this._image = undefined;
        return this;
    }

    /**
     * Задать исходное изображение. Его обязательно нужно задать до того как формировать спрайты.
     */
    public image(image: ImageSource): this {
        this._image = image;
        return this;
    }

    /**
     * Сколько строк кадров в спрайте. По-умолчанию 1.
     */
    public rows(rows: number): this {
        this._rows = rows;
        return this;
    }

    /**
     * Автоматически рассчитать сколько строк кадров в спрайте.
     */
    public autoRows(width: number): this {
        this._cols = undefined;
        this._width = width;
        return this;
    }

    /**
     * Сколько колонок кадров в спрайте. По-умолчанию 1.
     */
    public cols(cols: number): this {
        this._cols = cols;
        return this;
    }

    /**
     * Автоматически рассчитать сколько колонок кадров в спрайте.
     */
    public autoCols(height: number): this {
        this._rows = undefined;
        this._height = height;
        return this;
    }

    /**
     * Ширина кадров спрайта. Вычисляется автоматически на основе других параметров, если не указать.
     */
    public width(width: number): this {
        this._width = width;
        return this;
    }

    /**
     * Автоматически рассчитать ширину кадра на основе других параметров.
     */
    public autoWidth(cols: number): this {
        this._cols = cols;
        this._width = undefined;
        return this;
    }

    /**
     * Высота кадра спрайта. Вычисляется автоматически на основе других параметров, если не указать.
     */
    public height(height: number): this {
        this._height = height;
        return this;
    }

    /**
     * Автоматически рассчитать высоту кадра на основе других параметров.
     */
    public autoHeight(rows: number): this {
        this._rows = rows;
        this._height = undefined;
        return this;
    }

    /**
     * Кадры спрайта. Если в спрайте указаны кадры, все остальные параметры будут проигнорированы.
     */
    public frames(...views: SourceView[]): this {
        this._frames = views;
        return this;
    }

    /**
     * Очистить кадры спрайта.
     * Если не указать кадры, для формирования будут использоваться параметры width, height, rows и cols.
     */
    public clearFrames(): this {
        this._frames = [];
        return this;
    }

    /**
     * Добавить кадр к спрайту. Если в спрайте указаны кадры, все остальные параметры будут проигнорированы.
     */
    public pushFrame(view: SourceView): this {
        this._frames.push(view);
        return this;
    }

    /**
     * С какого кадра начинать резать спрайт.
     */
    public from(index: number): this {
        this._from = index;
        return this;
    }

    /**
     * Резать спрайт с первого кадра.
     */
    public fromStart(): this {
        this._row = undefined;
        this._from = 0;
        return this;
    }

    /**
     * До какого кадра резать спрайт.
     */
    public to(index: number): this {
        this._row = undefined;
        this._to = index;
        return this;
    }

    /**
     * Резать спрайт до последнего кадра.
     */
    public toEnd(): this {
        this._to = undefined;
        return this;
    }

    /**
     * Вырезать только указанные кадры.
     */
    public only(...indexes: number[]): this {
        this._indexes = indexes;
        return this;
    }

    /**
     * Добавить кадр к целевым.
     */
    public pushIndex(index: number): this {
        this._indexes.push(index);
        return this;
    }

    /**
     * Вырезать только кадры в определённой строке.
     */
    public row(row: number): this {
        this._row = row;
        return this;
    }

    /**
     * Если указана ширина кадра, но не кол-во колонок, или наоборот, вычисляет одно на основе другого.
     * Делает то же самое для высоты кадра и кол-ва строк.
     */
    protected computeSizesIfNeeded(): void {
        if (!this._image) throw new Error('Не указана картинка для спрайта!');

        if (!this._rows && !this._height) {
            throw new Error(`Необходимо указать или количество строк кадров, или высоту кадра!`);
        }

        if (!this._cols && !this._width) {
            throw new Error(`Необходимо указать или количество колонок кадров, или ширину кадра!`);
        }

        if (this._rows) {
            this._height ??= Math.floor((this._image.height - (this._offsetTop * 2)) / this._rows) - (this._rowSpan * (this._rows - 1));
        } else if (this._height) {
            this._rows ??= Math.floor(this._image.height - (this._offsetTop * 2) + this._rowSpan) / (this._height + this._rowSpan);
        }

        if (this._cols) {
            this._width ??= Math.floor((this._image.width - (this._offsetLeft * 2)) / this._cols) - (this._colSpan * (this._cols - 1))
        } else if (this._width) {
            this._cols ??= Math.floor(this._image.width - (this._offsetLeft * 2) + this._colSpan) / (this._width + this._colSpan);
        }
    }

    /**
     * Если указан диапазон кадров или строка, вычислит индексы кадров. Вызывать только после computeSizesIfNeeded.
     */
    protected computeIndexesIfNeeded(): void {
        if (this._row !== undefined) {
            this._from = this._cols! * (this._row);
            this._to = this._from + this._cols! - 1;
        }

        if (this._to) this._indexes = range(this._from, this._to);
    }

    /**
     * Рассчитает конфигурации кадров из индексов. Вызывать только после computeSizesIfNeeded.
     */
    protected computeFramesFromIndexes(): void {
        this._frames = this._indexes.map(index => {
            const currentRow = Math.floor(index / this._cols!);
            const currentCol = index - (currentRow * this._cols!);

            const colSpanOffset = currentCol === 0 ? 0 : this._colSpan * (currentCol - 1);
            const x = (this._width! * (currentCol)) - colSpanOffset

            const rowSpanOffset = currentRow === 0 ? 0 : this._rowSpan * (currentRow - 1);
            const y = (this._height! * (currentRow)) - rowSpanOffset

            return {
                x: x + this._offsetLeft,
                y: y + this._offsetTop,
                width: this._width!,
                height: this._height!,
            };
        });
    }

    /**
     * Создать спрайт с несколькими кадрами.
     */
    public sheet(): SpriteSheet {
        if (!this._image) throw new Error('Не указана картинка для спрайта!');

        if (this._frames.length) {
            return SpriteSheet.fromImageSourceWithSourceViews({
                image: this._image,
                sourceViews: this._frames,
            });
        }

        this.computeSizesIfNeeded();
        this.computeIndexesIfNeeded();

        if (this._indexes.length) {
            this.computeFramesFromIndexes();
            return SpriteSheet.fromImageSourceWithSourceViews({
                image: this._image,
                sourceViews: this._frames,
            });
        }

        return SpriteSheet.fromImageSource({
            image: this._image,
            grid: {
                rows: this._rows!,
                columns: this._cols!,
                spriteWidth: this._width!,
                spriteHeight: this._height!,
            },
            spacing: {
                originOffset: { x: this._offsetLeft, y: this._offsetTop },
                margin: { x: this._colSpan, y: this._rowSpan },
            },
        });
    }

    /**
     * Создать массив кадров.
     */
    public sprites(): Sprite[] {
        return this.sheet().sprites;
    }

    /**
     * Создать анимацию. Если кадры не указаны, будут использованы все кадры
     */
    public anim(type: AnimationStrategy = AnimationStrategy.Freeze, frameDuration: number = 100): Animation {
        const sheet = this.sheet();

        const anim = Animation.fromSpriteSheet(sheet, range(0, sheet.sprites.length - 1), frameDuration, type);
        anim.frameDuration = frameDuration;
        return anim;
    }

    /**
     * Создать один кадр.
     */
    public one(index: number = 0): Sprite {
        this.computeSizesIfNeeded();

        const currentRow = Math.floor(index / this._cols!);
        const currentCol = index - (currentRow * this._cols!);

        const colSpanOffset = currentCol === 0 ? 0 : this._colSpan * (currentCol - 1);
        const x = (this._width! * (currentCol)) - colSpanOffset

        const rowSpanOffset = currentRow === 0 ? 0 : this._rowSpan * (currentRow - 1);
        const y = (this._height! * (currentRow)) - rowSpanOffset

        return new Sprite({
            image: this._image!,
            sourceView: {
                x: x + this._offsetLeft,
                y: y + this._offsetTop,
                width: this._width!,
                height: this._height!,
            },
        });
    }

    /**
     * Создать массив кадров.
     */
    public many(): Sprite[];
    public many(to: number): Sprite[];
    public many(indexes: number[]): Sprite[];
    public many(from: number, to: number): Sprite[];
    public many(from?: number|number[], to?: number): Sprite[] {
        if (Array.isArray(from)) return from.map(this.one.bind(this));

        this.computeSizesIfNeeded();

        if (from === undefined) {
            to = this._to ?? (this._cols! - 1) + (this._cols! * ((this._rows ?? 1) - 1));
            from = this._from ?? 0;
        } else if (to === undefined) {
            to = from;
            from = this._from ?? 0;
        }

        return this.many(range(from, to));
    }

    /**
     * Создать массив кадров.
     */
    public all(): Sprite[] {
        this._indexes = [];
        return this.many();
    }

    /**
     * Создать bitmap-шрифт из спрайта.
     */
    public font(alphabet: string): SpriteFont {
        return new SpriteFont({
            alphabet: alphabet,
            spriteSheet: this.sheet(),
        });
    }
}

/**
 * Создать спрайт из картинки. Автоматически умеет рассчитывать размер кадра когда передано их кол-во и наоборот.
 * Режет кадры слева направо сверху вниз. Умеет создавать спрайтшит, массив спрайтов, анимацию, bitmap-шрифт.
 */
export function sprite(image: ImageSource) {
    return new SpriteBuilder().image(image);
}
