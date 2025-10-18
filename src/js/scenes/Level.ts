import {type Engine, Scene, TransformComponent, vec} from 'excalibur';
import {ParallaxBackground} from '@/entities/ParallaxBackground.ts';
import {Batches} from '@/resources.ts';
import {Player} from '@/entities/Player.ts';

class Level extends Scene {
    protected bg: ParallaxBackground;
    protected player: Player

    public constructor() {
        super();

        this.bg = new ParallaxBackground();
        this.player = new Player();
    }

    public onInitialize(engine: Engine) {
        this.bg.get(TransformComponent).z = 0;

        this.player.pos = vec(engine.drawWidth / 2, engine.drawHeight * .9); // todo игрок не в центре по x
        this.player.z = 1;

        this.add(this.bg);
        this.add(this.player);
    }
}

export const level = {
    scene: Level,
    loader: Batches.Level,
};
