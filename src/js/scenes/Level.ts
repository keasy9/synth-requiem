import {type Engine, Scene, TransformComponent, vec} from 'excalibur';
import {ParallaxBackground} from '@/entities/ParallaxBackground.ts';
import {Batches} from '@/resources.ts';
import {Player} from '@/entities/Player.ts';
import {Config} from '@/config.ts';
import {WorldBounds} from '@/entities/WorldBounds.ts';
import {Timeline} from '@/level/Timeline.ts';

class Level extends Scene {
    protected bg: ParallaxBackground;
    protected player: Player;
    protected bounds: WorldBounds;

    public constructor() {
        super();

        this.bg = new ParallaxBackground();
        this.bounds = new WorldBounds();
        this.player = new Player();
    }

    public onInitialize(_engine: Engine) {
        this.bg.get(TransformComponent).z = -1;

        this.player.pos = vec(Config.width / 2, Config.height * .9);

        this.add(this.bg);
        this.add(this.bounds);
        this.add(this.player);

        new Timeline();
    }

    public onPreUpdate(_engine: Engine, _elapsed: number) {
        this.bg.speedupFromSpeed(-this.player.getSpeed().y)
            .setOffsetFromPosition(this.player.getPosition().x);
    }
}

export const level = {
    scene: Level,
    loader: Batches.Level,
};
