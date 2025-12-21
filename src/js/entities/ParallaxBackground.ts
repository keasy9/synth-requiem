import {
    clamp,
    Color,
    Engine,
    Entity,
    GraphicsComponent,
    GraphicsGroup,
    type Sprite,
    TransformComponent,
    vec,
} from 'excalibur';
import {sprite} from '@/helpers/graphics/SpriteBuilder.ts';
import {Resources} from '@/resources.ts';
import {Config} from '@/config.ts';
import {easeInQuad} from '@/utils/math.ts';

const BgLayerType = {
    Stars: 'stars',
    Dust: 'dust',
} as const;

type AnyBgLayerType = typeof BgLayerType[keyof typeof BgLayerType];

const BgLayerVariant =  {
    Less: 'less',
    More: 'more',
} as const;

type AnyBgLayerVariant = typeof BgLayerVariant[keyof typeof BgLayerVariant];

const BgPlanetType = {
    Big: 'big',
    Medium: 'medium',
    Small: 'small',
    Tiny: 'tiny',
} as const;

type AnyBgPlanetType = typeof BgPlanetType[keyof typeof BgPlanetType];

type BgPlanetConf = {
    type: AnyBgPlanetType,
    at: [number, number],
    color?: string, // hex
}

export type ParallaxBackgroundConf = {
    layers?: Record<AnyBgLayerType, {
        variant: AnyBgLayerVariant,
        color?: string, // hex
        opacity?: number,
    }>,
    planets?: BgPlanetConf[],
    speed?: number
};

/**
 * Параллакс-фон. Двигаем слои не только при движении игрока, а вообще всегда, поэтому кастомный, а не встроенный в excalibur
 */
export class ParallaxBackground extends Entity<TransformComponent> {
    protected conf: ParallaxBackgroundConf = {};

    protected originalSpeed = .003;
    protected speed = .003;
    protected speedDiffMultiplier = .003;
    protected layers: Entity<GraphicsComponent | TransformComponent>[] = [];
    protected maxOffset: number = 0;
    protected planetLayer?: Entity<GraphicsComponent | TransformComponent>;

    public constructor() {
        super([new TransformComponent()]);
    }

    public setConf(conf: ParallaxBackgroundConf): this {
        this.conf = conf;

        return this;
    }

    public onInitialize(_engine: Engine) {
        this.makeLayers();
        this.makePlanets();
    }

    public onPreUpdate(engine: Engine, elapsed: number) {
        this.layers.forEach((layer: Entity, index) => {
            let y = layer.get(TransformComponent).pos.y;

            y += this.speed * (index+1) * elapsed;
            while (y >= engine.drawHeight) y -= engine.drawHeight;

            layer.get(TransformComponent).pos.y = y;
        });

        if (this.planetLayer) {
            let planetLayerY = this.planetLayer.get(TransformComponent).pos.y;

            planetLayerY += this.speed * (this.layers.length+1) * elapsed;
            while (planetLayerY >= engine.drawHeight) planetLayerY = -engine.drawHeight;

            this.planetLayer.get(TransformComponent).pos.y = planetLayerY;
        }
    }

    /**
     * На вход получае скорость объекта (напр, игрока) и ускоряется пропорционально
     * @param ySpeed
     */
    public speedupFromSpeed(ySpeed: number): this {
        this.speed = this.originalSpeed + this.originalSpeed + this.speedDiffMultiplier * clamp(ySpeed, -1, 2);

        return this;
    }

    /**
     * На вход получает положение объекта (напр, игрока) по x и сдвигается
     * @param xPos
     */
    public setOffsetFromPosition(xPos: number): this {
        const screenCenter = Config.width / 2;
        const distanceFromCenter = xPos - screenCenter;
        const normalizedDistance = distanceFromCenter / screenCenter;

        // Ограничиваем значение от -1 до 1
        const clampedDistance = Math.max(-1, Math.min(1, normalizedDistance));

        // Берем абсолютное значение для расчета ускорения
        const absDistance = Math.abs(clampedDistance);

        const easeFactor = easeInQuad(absDistance);

        const direction = Math.sign(clampedDistance);

        this.layers.forEach((layer: Entity, index) => {
            const layerSpeed = (index + 1) / this.layers.length;
            layer.get(TransformComponent).pos.x = this.maxOffset * easeFactor * direction * layerSpeed;
        });

        if (this.planetLayer) {
            this.planetLayer.get(TransformComponent).pos.x = this.maxOffset * easeFactor * direction * this.layers.length;
        }

        return this;
    }

    /**
     * Создать полноэкранные слои
     * @protected
     */
    protected makeLayers(): void {
        // предполагаем что фон инициализируется один раз за сцену, поэтому не кэшируем спрайты
        const layerSprites = sprite(Resources.SpriteSpace)
            .autoWidth(3)
            .autoHeight(2)
            .all();

        const layerSpritesMap = {
            [BgLayerType.Dust]: {
                [BgLayerVariant.Less]: layerSprites[0],
                [BgLayerVariant.More]: layerSprites[1],
            },
            [BgLayerType.Stars]: {
                [BgLayerVariant.Less]: layerSprites[3],
                [BgLayerVariant.More]: layerSprites[4],
            }
        };


        const xOffset = ((layerSprites[2]?.width ?? Config.height) - Config.width) / 2;
        this.maxOffset = Math.min(xOffset, 32);

        // основной статичный фон
        if (layerSprites[2]) {
            const mainBg = new Entity([new GraphicsComponent(), new TransformComponent()]);
            mainBg.get(GraphicsComponent).use(layerSprites[2]);
            mainBg.get(GraphicsComponent).offset = vec(-xOffset, 0);
            mainBg.get(GraphicsComponent).anchor = vec(0, 0);

            this.addChild(mainBg);
        }

        // слои (туманности, звёзды)
        this.layers = [];
        if (this.conf.layers) {
            for (let [layerName, layerConf] of Object.entries(this.conf.layers)) {
                const layer = new Entity([new TransformComponent(), new GraphicsComponent()]);

                const sprite = layerSpritesMap[layerName as AnyBgLayerType][layerConf.variant] as Sprite;

                if (layerConf.color) sprite.tint = Color.fromHex(layerConf.color);
                if (layerConf.opacity) sprite.opacity = layerConf.opacity;

                layer.get(GraphicsComponent).use(new GraphicsGroup({
                    useAnchor: false,
                    members: [
                        {graphic: sprite.clone(), offset: vec(-xOffset, -sprite.height)},
                        {graphic: sprite, offset: vec(-xOffset, 0)},
                    ],
                }));

                this.layers.push(layer);
            }
        }

        this.layers.forEach(l => this.addChild(l));
    }

    /**
     * Создать слой с мланетами
     * @protected
     */
    protected makePlanets(): void {
        if (!this.conf.planets?.length) return;

        // предполагаем что планеты инициализируются один раз за сцену, поэтому не кэшируем спрайты
        const planetSprites = sprite(Resources.SpritePlanets)
            .frames( // todo json?
                {x: 0, y: 0, width: 136, height: 136},
                {x: 136, y: 0, width: 82, height: 82},
                {x: 218, y: 0, width: 70, height: 70},
                {x: 136, y: 82, width: 54, height: 54},
            ).sprites();

        const planetSpritesMap = {
            [BgPlanetType.Big]: planetSprites[0],
            [BgPlanetType.Medium]: planetSprites[1],
            [BgPlanetType.Small]: planetSprites[2],
            [BgPlanetType.Tiny]: planetSprites[3],
        };

        const planetLayer = new Entity([new TransformComponent(), new GraphicsComponent()]);
        planetLayer.get(GraphicsComponent).use(new GraphicsGroup({
            useAnchor: false,
            members: this.conf.planets.map(planetConf => {
                const sprite = planetSpritesMap[planetConf.type]!.clone();

                if (planetConf.color) sprite.tint = Color.fromHex(planetConf.color);

                return {
                    graphic: sprite,
                    offset: vec(
                        -sprite.width + planetConf.at[0] * (Config.width + sprite.width),
                        -sprite.height + planetConf.at[1] * (Config.height + sprite.height)
                    ),
                };
            }),
        }));

        this.planetLayer = planetLayer;
        this.addChild(planetLayer);
    }
}