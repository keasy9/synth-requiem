import {CollisionStartEvent, type Entity, EntityEvents, EventTypes} from 'excalibur';
import {ColliderComponent} from 'excalibur';
import type {KillEvent} from 'excalibur';
import {isDamageTaker} from '@/entities/interfaces/DamageTaker.ts';
import {isDamageProvider} from '@/entities/interfaces/DamageProvider.ts';

class Collider {
    public on(entity: Entity<ColliderComponent>): void {
        entity.on(EntityEvents.Kill, this.onKill.bind(this));
        entity.get(ColliderComponent).events.on(EventTypes.CollisionStart, this.onCollisionStart.bind(this));
    }

    public off(entity: Entity): void {
        entity.off(EntityEvents.Kill, this.onKill.bind(this));
    }

    public onKill(event: KillEvent): void {
        this.off(event.target);
    }

    public onCollisionStart(event: CollisionStartEvent): void {
        const self = event.self.owner;
        const other = event.other.owner;

        if (isDamageTaker(self) && isDamageProvider(other)) self.takeDamage(other.damage);
        if (isDamageTaker(other) && isDamageProvider(self)) other.takeDamage(self.damage);
    }
}

const collider = new Collider();

export function collide(entity: Entity<ColliderComponent>): void {
    collider.on(entity);
}
