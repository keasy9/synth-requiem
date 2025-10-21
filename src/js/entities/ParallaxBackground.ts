import {clamp, Engine, Entity, GraphicsComponent, GraphicsGroup, TransformComponent, vec} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import {lerpInterval} from '@/utils/math.ts';
import {Config} from '@/config.ts';

export class ParallaxBackground extends Entity<TransformComponent> {
    protected originalSpeed = .003;
    protected speed = .003;
    protected speedDiffMultiplier = .002;
    protected layers: Entity<GraphicsComponent | TransformComponent>[] = [];
    protected layerScale = 1.1;  // фон должен быть шире игры чтобы можно было его прокручивать по x
    protected layerWidth = 128;
    protected maxOffset: number = 0;

    public constructor() {
        super([new TransformComponent()]);
    }

    public onInitialize(_engine: Engine) {
        this.layers = sprite(Resources.SpriteBackground)
            .autoWidth(3)
            .all()
            .map(sprite => {
                const layer = new Entity([new GraphicsComponent(), new TransformComponent()]);

                layer.get(GraphicsComponent).use(new GraphicsGroup({
                    useAnchor: false,
                    members: [
                        {graphic: sprite.clone(), offset: vec(0, -sprite.height)},
                        {graphic: sprite, offset: vec(0, 0)},
                    ],
                }));
                layer.get(TransformComponent).scale = vec(this.layerScale, this.layerScale);
                layer.get(TransformComponent).pos.x = -((sprite.width * this.layerScale) - sprite.width) / 2;

                this.addChild(layer);

                return layer;
            });

        this.maxOffset = ((this.layerWidth * this.layerScale) - this.layerWidth) / 2;
    }

    public onPreUpdate(engine: Engine, elapsed: number) {
        this.layers.forEach((layer: Entity, index) => {
            let y = layer.get(TransformComponent).pos.y;

            y += this.speed * index * elapsed;
            while (y >= engine.drawHeight) y -= engine.drawHeight * this.layerScale;

            layer.get(TransformComponent).pos.y = y;
        });
    }

    public speedupFromSpeed(ySpeed: number): this {
        this.speed = this.originalSpeed + this.originalSpeed + this.speedDiffMultiplier * clamp(ySpeed, -1, 2);

        return this;
    }

    public setOffsetFromPosition(xPos: number): this {
        this.layers.forEach((layer: Entity, index) => {
            layer.get(TransformComponent).pos.x = lerpInterval(
                xPos,
                0,
                Config.width,
                -this.maxOffset,
                this.maxOffset
            ) * index / (this.layers.length - 1);
        });

        return this;
    }
}