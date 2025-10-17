import {Color, DisplayMode} from 'excalibur';
import {level} from '@/scenes/Level.ts';

export const Config = {
    width: 128,
    height: 256,
    displayMode: DisplayMode.FitScreenAndFill,
    pixelArt: true,
    backgroundColor: Color.Black,
    canvasElementId: 'canvas',
    scenes: {
        level,
    }
} as const;
