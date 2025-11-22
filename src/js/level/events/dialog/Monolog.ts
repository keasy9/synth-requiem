import {type Animation, AnimationStrategy, ScreenElement, vec} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';

const NpcPortrait = {
    General: 'general',
    Astronaut: 'astronaut',
    Soldier: 'soldier',
    Glorp: 'glorp',
    Engineer: 'engineer',
    Snail: 'snail',
    Deer: 'deer',
    Emoji: 'emoji',
    Girl: 'girl',
    Ant: 'ant',
    Noice: 'noice',
} as const;

type AnyNpcPortrait = typeof NpcPortrait[keyof typeof NpcPortrait];

const NpcPortraitTypeToSpriteRow = {
    [NpcPortrait.General]: 0,
    [NpcPortrait.Astronaut]: 1,
    [NpcPortrait.Soldier]: 2,
    [NpcPortrait.Glorp]: 3,
    [NpcPortrait.Engineer]: 4,
    [NpcPortrait.Snail]: 5,
    [NpcPortrait.Deer]: 6,
    [NpcPortrait.Emoji]: 7,
    [NpcPortrait.Girl]: 8,
    [NpcPortrait.Ant]: 9,
    [NpcPortrait.Noice]: 10,
} as const;

type MonologAnswer = {
    text: string,
    nextMonolog?: number, // индекс в monologues родительского диалога
}

export type MonologConf = {
    npc: AnyNpcPortrait,
    name: string,
    text: string, // todo локализация, и цветные вставки как в katana zero
    answers?: MonologAnswer[],
    nextMonolog?: number, // индекс в monologues родительского диалога
    time?: number,
}

export class Monolog extends ScreenElement {
    protected static instance: Monolog;
    protected npcPortraits: Partial<Record<AnyNpcPortrait, Animation>> = {};

    protected constructor() {
        super();
    }

    public static create(conf: MonologConf): Monolog {
        this.instance ??= new Monolog();
        return this.instance.init(conf);
    }

    public init(conf: MonologConf): this {
        // todo ui делать на HTML
        this.npcPortraits[conf.npc] ??= sprite(Resources.SpriteCharacters)
            .autoRows(8)
            .autoCols(8)
            .row(NpcPortraitTypeToSpriteRow[conf.npc])
            .anim(AnimationStrategy.PingPong, 300);

        this.npcPortraits[conf.npc]!.scale = vec(2, 2);

        this.graphics.use(this.npcPortraits[conf.npc]!);

        return this;
    }
}