import {UiElemDto} from '@/ui/builder/UiElemDto.ts';
import {reactive} from 'vue';

export const UiState = reactive<Record<string, UiElemDto>>({})
