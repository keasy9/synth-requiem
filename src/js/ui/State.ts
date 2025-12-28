import {UiElemDto} from '@/ui/dto/UiElemDto.ts';
import {type Reactive, reactive} from 'vue';

export const UiState = reactive<Record<string, Reactive<UiElemDto>>>({})

let nextElemId = 1;
export function getElemId(): number {
    return nextElemId++;
}