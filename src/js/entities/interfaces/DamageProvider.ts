import type {Entity} from 'excalibur';

export interface DamageProvider extends Entity {
    get damage(): number;
}

export function isDamageProvider(entity: Entity): entity is DamageProvider {
    return ('damage' in entity) && (typeof entity.damage === 'number');
}
