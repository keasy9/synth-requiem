import {Engine} from 'excalibur';
import {Config} from '@/config.ts';
import {Batches} from '@/resources.ts';

export const GAME = new Engine(Config);

GAME.start(Batches.Main);
