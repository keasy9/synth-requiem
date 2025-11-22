import {ImageSource} from 'excalibur';
import {Intro} from '@/loaders/Intro.ts';
import {Default} from '@/loaders/Default.ts';
import {BitmapFontSource} from '@/loadables/BitmapFontSource.ts';

export const Resources = {
    SpriteBackground: new ImageSource('./assets/sprites/space.png'),
    SpritePlayers: new ImageSource('./assets/sprites/players.png'),
    SpriteExhausts: new ImageSource('./assets/sprites/exhaust.png'),
    SpriteEnemies: new ImageSource('./assets/sprites/enemies.png'),
    SpriteBullets: new ImageSource('./assets/sprites/bullets.png'),
    SpriteExplosions: new ImageSource('./assets/sprites/explosions.png'),
    SpriteCharacters: new ImageSource('./assets/sprites/characters.png'),
    TinyNumbersFont: new BitmapFontSource('./assets/sprites/fonts/tinynumbers.fnt'),
} as const;

// ресурсы которые нужны сразу после старта игры или на протяжении всей игры
const mainBatch = new Intro();
mainBatch.addResources([
    Resources.SpriteBackground,
]);

// ресурсы, которые нужны для игровых уровней
const levelBatch = new Default();
levelBatch.addResources([
    Resources.SpritePlayers,
    Resources.SpriteExhausts,
    Resources.SpriteEnemies,
    Resources.SpriteBullets,
    Resources.SpriteExplosions,
    Resources.TinyNumbersFont,
    Resources.SpriteCharacters,
]);

export const Batches = {
    Main: mainBatch,
    Level: levelBatch,
} as const;
