import {DisplayMode, Engine} from 'excalibur';

const game = new Engine({
    width: 128,
    height: 256,
    displayMode: DisplayMode.FitScreenAndFill,
    pixelArt: true,
    canvasElementId: 'canvas',
});