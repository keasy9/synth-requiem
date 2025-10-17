import {Engine, Entity, GraphicsComponent, MotionComponent, TransformComponent} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';

export class ParallaxBackground extends Entity<TransformComponent | MotionComponent | GraphicsComponent> {
    public onInitialize(_engine: Engine) {
        this.addComponent(new TransformComponent())
            .addComponent(new MotionComponent())
            .addComponent(new GraphicsComponent());

        const sprites = sprite(Resources.SpriteBackground)
            .autoHeight(3)
            .all();
    }
}