import {Color, Label as ExLabel, RentalPool, SpriteFont, vec, type Vector} from 'excalibur';
import {GAME} from '@/main.ts';
import {Font, font, type FontKey} from '@/helpers/graphics/FontStorage.ts';

export class Label extends ExLabel {

    constructor(text: string, pos: Vector, fontName: FontKey) {
        const fontInstance = font(fontName);
        let spriteFont, webFont;

        if (fontInstance instanceof SpriteFont) {
            spriteFont = fontInstance;
        } else {
            webFont = fontInstance;
        }

        super({
            color: Color.White,
            text: text,
            pos: pos,
            spriteFont: spriteFont,
            font: webFont,
        });
    }
}

class LabelBuilder {
    protected static pools: Partial<Record<FontKey, RentalPool<Label>>> = {};
    protected _font: FontKey = Font.Numbers;
    protected _pos: Vector = vec(0, 0);
    protected _color?: Color;
    protected _scale: Vector = vec(1, 1);

    public at(pos: Vector): this;
    public at(x: number, y: number): this;
    public at(xOrPos: number|Vector, y?: number): this {
        if (typeof xOrPos === 'number') {
            this._pos.x = xOrPos;
            this._pos.y = y ?? 0;
        } else {
            this._pos = xOrPos;
        }

        return this;
    }

    public size(scale: Vector): this;
    public size(scale: number): this;
    public size(xScale: number, yScale: number): this;
    public size(scaleOrX: number|Vector, y?: number): this {
        if (typeof scaleOrX === 'number') {
            this._scale.x = scaleOrX;
            this._scale.y = y ?? scaleOrX;
        } else {
            this._scale = scaleOrX;
        }

        return this;
    }


    public color(color: Color): this {
        this._color = color;
        return this;
    }

    public write(text: string|number): Label {
        LabelBuilder.pools[this._font] ??= new RentalPool(
            () => new Label('', vec(0, 0), this._font),
            (used) => used,
        );

        const instance = LabelBuilder.pools[this._font]!.rent();

        instance.pos = this._pos;
        instance.text = String(text);
        instance.scale = this._scale;

        if (this._color) {
            instance.color = this._color;
            if (instance.graphics.current) instance.graphics.current.tint = this._color;
        }

        GAME.add(instance);

        return instance;
    }
}

export function label() {
    return new LabelBuilder();
}

export function damageNumber(damage: number, pos: Vector, isTargetDied: boolean = false) {
    label()
        .at(pos)
        .size(.7)
        .color(isTargetDied ? Color.Vermilion : Color.White)
        .write(damage)
        .actions
        .moveBy(vec(0, -5), 10)
        .fade(0, 200)
        .die();
}