import {Font as WebFont, SpriteFont} from 'excalibur';
import {Resources} from '@/resources.ts';
import type {BitmapFont} from '@/helpers/graphics/BitmapFont.ts';
import type {EnumValue} from '@/utils/types.ts';

class FontStorage extends Map<string, SpriteFont|WebFont> {
    public get<K extends FontKey>(key: K): FontTypeMap[K] {
        if (!this.has(key)) this.create(key);
        return super.get(key) as FontTypeMap[K];
    }

    protected create(key: FontKey): void {
        switch (key) {
            case Font.Numbers:
                this.set(key, Resources.TinyNumbersFont.toFont());
                break;
        }
    }
}

export const Font = {
    Numbers: 'numbers',
} as const;

export type FontKey = EnumValue<typeof Font>;

type FontTypeMap = {
    [Font.Numbers]: BitmapFont,
};

const Storage = new FontStorage();
export function font<K extends FontKey>(font: K): FontTypeMap[K] {
    return Storage.get(font);
}
