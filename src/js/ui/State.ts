import {type Reactive, reactive} from 'vue';
import {DomElement, type DomElementDto} from '@/ui/entities/abstract/DomElement.ts';

export const UiDtoState = reactive<Record<string, Reactive<DomElementDto>>>({});
export const UiElementsState: Record<string, DomElement> = {};
