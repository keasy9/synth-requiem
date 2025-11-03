import {type Engine, Resource, Scene, TransformComponent, vec} from 'excalibur';
import {ParallaxBackground} from '@/entities/ParallaxBackground.ts';
import {Batches} from '@/resources.ts';
import {Player} from '@/entities/Player.ts';
import {Config} from '@/config.ts';
import {WorldBounds} from '@/entities/WorldBounds.ts';
import {Timeline, type TimelineEventConf} from '@/level/Timeline.ts';
import type {Default} from '@/loaders/Default.ts';

type LevelConfig = {
    id: string,
    timeline: TimelineEventConf[],
}

class Level extends Scene {
    protected bg: ParallaxBackground;
    protected player: Player;
    protected bounds: WorldBounds;

    protected levelNumber: number;
    protected levelData: Resource<LevelConfig>;
    protected timeline: Timeline;

    public constructor(levelNumber = 1) {
        super();

        this.bg = new ParallaxBackground();
        this.bounds = new WorldBounds();
        this.player = new Player();

        this.levelNumber = levelNumber;
        this.levelData = new Resource<LevelConfig>(`./data/levels/${levelNumber}.json`, 'json');
        this.timeline = new Timeline();
    }

    public onPreLoad(loader: Default): void {
        loader.addResource(this.levelData);
    }

    public onInitialize(_engine: Engine) {
        this.bg.get(TransformComponent).z = -1;
        this.bounds.get(TransformComponent).z = 100;

        this.player.pos = vec(Config.width / 2, Config.height * .9);

        this.add(this.bg);
        this.add(this.bounds);
        this.add(this.player);

        if (!this.levelData.data.timeline) throw new Error(`Не удалось загрузить уровень [${this.levelNumber}]!`);

        this.timeline.buildPlan(this.levelData.data.timeline);
    }

    public onPreUpdate(engine: Engine, elapsed: number) {
        this.bg.speedupFromSpeed(-this.player.getSpeed().y)
            .setOffsetFromPosition(this.player.getPosition().x);

        this.timeline.onPreUpdate(engine, elapsed);
    }
}

export const level = {
    scene: Level,
    loader: Batches.Level,
};
