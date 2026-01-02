import {type Reactive, reactive} from 'vue';
import type {DomElement} from '@/ui/entities/abstract/DomElement.ts';

export const UiState = reactive<Record<string, Reactive<DomElement>>>({})
