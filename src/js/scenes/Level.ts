import {type Engine, Scene} from 'excalibur';
import {ParallaxBackground} from '@/entities/ParallaxBackground.ts';
import {Batches} from '@/resources.ts';

class Level extends Scene {
    protected bg: ParallaxBackground;

    public constructor() {
        super();

        this.bg = new ParallaxBackground();
    }

    public onInitialize(_engine: Engine) {
        this.add(this.bg);
    }
}

export const level = {
    scene: Level,
    loader: Batches.Level,
};
