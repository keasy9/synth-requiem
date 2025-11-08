import type {Entity} from 'excalibur';

export interface DamageTaker extends Entity {
    takeDamage(damage: number): void;
}

export function isDamageTaker(entity: Entity): entity is DamageTaker {
    return ('takeDamage' in entity) && (typeof entity.takeDamage === 'function');
}
