import {Color, DisplayMode, ImageFiltering} from 'excalibur';
import {level} from '@/scenes/Level.ts';

const width = 256;
const height = 512;

const canvasElem = document.getElementById('canvas');
if (!canvasElem || !(canvasElem instanceof HTMLCanvasElement)) throw new Error('Canvas не найден!');

const scale = Math.ceil(
    Math.max(canvasElem.offsetWidth / width, canvasElem.offsetHeight / height)
) * Math.max(2, window.devicePixelRatio); // минимум 2 для плавного движения

export const Config = {
    width: width,
    height: height,
    displayMode: DisplayMode.FitScreenAndFill,
    pixelArt: true,
    antialiasing: false,
    filtering: ImageFiltering.Pixel,
    pixelRatio: scale,
    backgroundColor: Color.Black,
    canvasElement: canvasElem,
    fixedUpdateFps: 30,
    scenes: {
        level,
    }
} as const;
