import { CollisionGroup } from "excalibur";

function createGroupsFromMap<T extends string>(collisionMap: Partial<Record<T, T[]>>, options: {symmetric?: boolean} = {}): Record<T, CollisionGroup> {
    const { symmetric = true } = options; // Автоматически делать коллизии симметричными

    // Собираем все уникальные имена групп
    const allGroupNames = new Set<T>([
        ...Object.keys(collisionMap) as T[],
        ...Object.values<T[]>(collisionMap).flat(),
    ]);

    // Проверяем, что не превышен лимит групп (32 бита)
    if (allGroupNames.size > 32) {
        throw new Error(`Слишком много групп коллизий: ${allGroupNames.size}. Максимум 32.`);
    }

    // Создаем категории
    const categories = {} as Record<T, number>;
    let currentBit = 1;

    allGroupNames.forEach(groupName => {
        categories[groupName] = currentBit;
        currentBit <<= 1;
    });

    // Создаем расширенную карту коллизий (с симметрией если нужно)
    const expandedCollisionMap = { ...collisionMap };

    if (symmetric) {
        // Добавляем симметричные коллизии
        (Object.keys(collisionMap) as T[]).forEach(sourceGroup => {
            collisionMap[sourceGroup]!.forEach(targetGroup => {
                if (!expandedCollisionMap[targetGroup]) {
                    expandedCollisionMap[targetGroup] = [];
                }
                if (!expandedCollisionMap[targetGroup].includes(sourceGroup)) {
                    expandedCollisionMap[targetGroup].push(sourceGroup);
                }
            });
        });
    }

    // Создаем группы
    const groups = {} as Record<T, CollisionGroup>;

    allGroupNames.forEach(groupName => {
        let mask = 0;

        if (expandedCollisionMap[groupName]) {
            expandedCollisionMap[groupName].forEach(targetGroup => {
                if (categories[targetGroup]) {
                    mask |= categories[targetGroup];
                } else {
                    console.warn(`Collision group "${targetGroup}" not found for "${groupName}"`);
                }
            });
        }

        groups[groupName] = new CollisionGroup(groupName, categories[groupName], mask);
    });

    return groups;
}

export const CollisionGroups = createGroupsFromMap({
    World: ['Player'],
    Player: ['World', 'Enemy', 'EnemyBullet'],
    Enemy: ['Player', 'PlayerBullet']
});
