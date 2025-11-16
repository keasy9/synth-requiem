import {
    BoundingBox,
    type ExcaliburGraphicsContext,
    Sprite,
    SpriteFont,
    type SpriteFontOptions,
    SpriteSheet,
    Vector,
} from 'excalibur';
import type {BitmapFontSource} from '@/loadables/BitmapFontSource.ts';

export interface BitmapFontOptions extends SpriteFontOptions {
    kernings: Record<number, Record<number, number>>,
}

/**
 * Bitmap-шрифт.
 */
export class BitmapFont extends SpriteFont {
    public kernings: Record<string, Record<string, number>> = {};

    public constructor(options: BitmapFontOptions) {
        super(options);
        this.kernings = options.kernings;
    }

    public static from(source: BitmapFontSource): BitmapFont {
        const sortedCharIds = Object.keys(source.data.chars)
            .map(Number)
            .filter(id => source.data.chars[id]!.page in source.data.pages)
            .sort((a, b) => a - b);

        const sheet = new SpriteSheet({
            sprites: sortedCharIds.map(id => {
                const char = source.data.chars[id]!;
                return new Sprite({
                    image: source.data.pages[char.page]!,
                    sourceView: char,
                });
            }),
        });

        const kernings: Record<string, Record<string, number>> = {};
        for (let [firstCharId, secondCharIdAndKerning] of Object.entries(source.data.kernings)) {
            for (let [secondCharId, kerning] of Object.entries(secondCharIdAndKerning)) {
                const firstChar = String.fromCharCode(Number(firstCharId));
                kernings[firstChar] ??= {};
                kernings[firstChar][String.fromCharCode(Number(secondCharId))] = kerning;
            }
        }

        return new BitmapFont({
            alphabet: sortedCharIds.map(id => String.fromCharCode(id)).join(''),
            spriteSheet: sheet,
            kernings: kernings,
            spacing: 1,
        });
    }

    public measureText(text: string, maxWidth?: number): BoundingBox {
        // @ts-ignore
        const lines: string[] = this._getLinesFromText(text, maxWidth);
        const maxWidthLine = lines.reduce((a, b) => {
            return a.length > b.length ? a : b;
        });
        //@ts-ignore
        const sprites: Sprite[] = this._getCharacterSprites(maxWidthLine);
        let width = 0;
        let height = 0;
        sprites.forEach((sprite, index) => {
            width += sprite.width + this.getKerning(maxWidthLine[index]!, maxWidthLine[index + 1]);
            height = Math.max(height, sprite.height);
        });

        return BoundingBox.fromDimension(
            Math.ceil(width * this.scale.x),
            Math.ceil(height * lines.length * this.scale.y),
            Vector.Zero,
        );
    }

    protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number, maxWidth?: number): void {
        // todo артифакты если позиция лейбла по x > 10. Скорее всего по y тоже, если в спрайте будет больше одной строки символов
        let xCursor = 0;
        let yCursor = 0;
        let height = 0;

        //@ts-ignore
        const lines = this._getLinesFromText(this._text, maxWidth);
        for (const line of lines) {
            //@ts-ignore
            this._getCharacterSprites(line).forEach((sprite: Sprite, index: number) => {
                // draw it in the right spot and increase the cursor by sprite width
                sprite.draw(ex, x + xCursor, y + yCursor);
                xCursor += sprite.width + this.getKerning(line[index], line[index + 1]);
                height = Math.max(height, sprite.height);
            })
            xCursor = 0;
            yCursor += this.lineHeight ?? height;
        }
    }

    public getKerning(firstCharOrString: string, secondChar?: string): number {
        if (firstCharOrString.length < (secondChar ? 1 : 2)) return this.spacing;

        const first = firstCharOrString[0]!;
        const second = secondChar ?? firstCharOrString[1]!;

        return this.kernings[first] ? (this.kernings[first][second] ?? this.spacing) : this.spacing;

    }

    //@ts-ignore
    public clone(): BitmapFont {
        return new BitmapFont({
            alphabet: this.alphabet,
            spriteSheet: this.spriteSheet,
            kernings: this.kernings,
        });
    }
}