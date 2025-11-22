import {
    type Animation, AnimationEvents,
    AnimationStrategy,
    type Engine,
    Entity,
    GraphicsComponent,
    RentalPool,
    TransformComponent,
    type Vector,
} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import {GAME} from '@/main.ts';
import type {EnumValue} from '@/utils/types.ts';

// значение - строка в спрайте
export const ExplosionType = {
    Pink: 0,
    Orange: 1,
    Blue: 2,
} as const;

export type AnyExplosionType = EnumValue<typeof ExplosionType>;

export class Explosion extends Entity<GraphicsComponent | TransformComponent> {

    protected static animations: Partial<Record<AnyExplosionType, Animation>> = {};
    protected static pool?: RentalPool<Explosion>;

    protected type: AnyExplosionType;

    constructor(type: AnyExplosionType = ExplosionType.Orange) {
        super([new GraphicsComponent(), new TransformComponent()]);
        this.type = type;
    }

    public onInitialize(_engine: Engine) {
        this.makeAnimFromType();
    }

    protected makeAnimFromType() {
        Explosion.animations[this.type] ??= sprite(Resources.SpriteExplosions)
            .autoWidth(4)
            .autoHeight(3)
            .row(this.type)
            .anim(AnimationStrategy.End);

        const graph = this.get(GraphicsComponent);

        graph.use(Explosion.animations[this.type]!.clone());
        (graph.current as Animation).goToFrame(0);
        (graph.current as Animation).events.on(AnimationEvents.End, () => this.kill());

    }

    public setType(type: AnyExplosionType): this {
        this.type = type;
        this.makeAnimFromType();
        return this;
    }

    public setPos(pos: Vector): this {
        this.get(TransformComponent).pos = pos;
        return this;
    }

    public static explode(type: AnyExplosionType = ExplosionType.Orange, pos: Vector): Explosion
    {
        this.pool ??= new RentalPool(() => new Explosion(), explosion => explosion);

        const instance = this.pool.rent(true);
        GAME.add(instance);

        return instance.setPos(pos).setType(type);
    }
}