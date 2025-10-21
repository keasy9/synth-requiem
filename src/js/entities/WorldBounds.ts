import {
    Actor,
    CollisionType,
    Color,
    CompositeCollider,
    EdgeCollider,
    type Engine,
    GraphicsGroup, type GraphicsGrouping,
    Rectangle,
    vec,
} from 'excalibur';
import {Config} from '@/config.ts';
import {GAME} from '@/main.ts';

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

    /**
     * Создаёт коллайдер границ мира
     * @protected
     */
    protected createCollider() {
        this.collider.set(new CompositeCollider([
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
            }),
        ]));
    }

    /**
     * Создаёт полупрозрачные прямоугольники для обозначения границ мира
     * todo более явное обозначение, например размытие
     * @protected
     */
    protected createGraphics() {
        const boundsColor = Color.Black;

        const offsetX = (GAME.drawWidth - Config.width) / 2;
        const offsetY = (GAME.drawHeight - Config.height) / 2;

        const bounds: GraphicsGrouping[] = [];

        if (offsetX !== 0) {
            bounds.push(
                {
                    graphic: new Rectangle({
                        width: offsetX,
                        height: GAME.drawHeight,
                        color: boundsColor,
                    }),
                    offset: vec(-offsetX, -offsetY),
                },
                {
                    graphic: new Rectangle({
                        width: offsetX,
                        height: GAME.drawHeight,
                        color: boundsColor,
                    }),
                    offset: vec(GAME.drawWidth - offsetX * 2, -offsetY),
                }
            );
        }

        if (offsetY !== 0) {
            bounds.push(
                {
                    graphic: new Rectangle({
                        width: GAME.drawWidth,
                        height: offsetY,
                        color: boundsColor,
                    }),
                    offset: vec(-offsetX, -offsetY),
                },
                {
                    graphic: new Rectangle({
                        width: GAME.drawWidth,
                        height: offsetY,
                        color: boundsColor,
                    }),
                    offset: vec(-offsetX, GAME.drawHeight - offsetY * 2),
                },
            );
        }

        this.graphics.use(new GraphicsGroup({
            useAnchor: false,
            members: bounds,
        }));

        this.graphics.opacity = .7;
    }

    public onInitialize(_engine: Engine) {
        this.createCollider();
        this.createGraphics();
    }
}