import {Color, DisplayMode} from 'excalibur';
import {level} from '@/scenes/Level.ts';

const width = 128;
const height = 256;

const canvasElem = document.getElementById('canvas');
if (!canvasElem) throw new Error('Canvas не найден!');

const scale = Math.ceil(
    Math.max(canvasElem.offsetWidth / width, canvasElem.offsetHeight / height)
) * (window.devicePixelRatio ?? 1);

export const Config = {
    width: width,
    height: height,
    displayMode: DisplayMode.FitScreenAndFill,
    pixelArt: true,
    pixelRatio: scale + 1,
    backgroundColor: Color.Black,
    canvasElement: canvasElem,
    scenes: {
        level,
    }
} as const;
