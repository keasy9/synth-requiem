import {Engine, Entity, GraphicsComponent, GraphicsGroup, TransformComponent, vec} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';

export class ParallaxBackground extends Entity {
    protected speed = .005;
    protected layers: Entity<GraphicsComponent | TransformComponent>[] = [];
    protected layerScale = 1.1;  // фон должен быть шире игры чтобы можно было его прокручивать по x


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
    }

    public onPreUpdate(engine: Engine, elapsed: number) {
        this.layers.forEach((layer: Entity, index) => {
            let y = layer.get(TransformComponent).pos.y;

            y += this.speed * index * elapsed;
            while (y >= engine.drawHeight) y -= engine.drawHeight * this.layerScale;

            layer.get(TransformComponent).pos.y = y;
        });
    }
}