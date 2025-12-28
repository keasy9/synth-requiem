import {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import type {Color} from 'excalibur';
import {UiColor} from '@/ui/Ui.ts';

export class UiBarDto extends UiElemDto {
    public colors: Record<number, Color> = {100: UiColor.Accent};
    public progress: number = 100; // от 1 до 0
    public height: number = 2;

    public paintAt(progress: number, color: Color): this {
        this.colors[progress] = color;
        return this;
    }

    public setProgress(progress: number): this {
        this.progress = Math.min(Math.max(progress, 0), 100);
        return this;
    }

    public setHeight(height: number): this {
        this.height = height;
        return this;
    }
}