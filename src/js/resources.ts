import {ImageSource} from 'excalibur';
import {Intro} from '@/loaders/Intro.ts';

export const Resources = {
    SpriteBackground: new ImageSource('./assets/sprites/space.png'),
} as const;

// ресурсы которые нужны сразу после старта игры или на протяжении всей игры
const mainBatch = new Intro();
mainBatch.addResources([
    Resources.SpriteBackground,
]);

export const Batches = {
    Main: mainBatch,
} as const;