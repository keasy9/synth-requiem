import {Actor, CollisionType, CompositeCollider, EdgeCollider, type Engine, vec} from 'excalibur';
import {Config} from '@/config.ts';

export class WorldBounds extends Actor {
    public constructor() {
        super({
            x: 0,
            y: 0,
            width: Config.width,
            height: Config.height,
            collisionType: CollisionType.Fixed,
        });
    }

    public onInitialize(_engine: Engine) {
        // Создаем CompositeCollider из всех границ
        const composite = new CompositeCollider([
            // верх
            new EdgeCollider({
                begin: vec(0, 0),
                end: vec(Config.width, 0),
            }),
            // право
            new EdgeCollider({
                begin: vec(Config.width, 0),
                end: vec(Config.width, Config.height),
            }),
            // низ
            new EdgeCollider({
                begin: vec(Config.width, Config.height),
                end: vec(0, Config.height),
            }),
            // лево
            new EdgeCollider({
                begin: vec(0, Config.height),
                end: vec(0, 0),
            })
        ]);

        this.collider.set(composite);
    }
}