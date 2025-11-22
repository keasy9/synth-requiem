import {BoundingBox, Engine} from 'excalibur';
import {Config} from '@/config.ts';
import {Batches} from '@/resources.ts';
import {createApp} from 'vue';
import UiManager from '@/components/UiManager.vue';

class Game extends Engine {
    public get screenBox(): BoundingBox {
        const offsetX = (this.drawWidth - Config.width) / 2;
        const offsetY = (this.drawHeight - Config.height) / 2;

        return new BoundingBox(
            -offsetX,
            -offsetY,
            Config.width + offsetX,
            Config.height + offsetY,
        );
    }
}

export const GAME = new Game(Config);

GAME.start(Batches.Main).then(() => {
    GAME.goToScene('level');
});

createApp(UiManager).mount('#ui');
