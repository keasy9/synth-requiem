import {UiElemDto} from '@/helpers/ui/UiElemDto.ts';
import {reactive} from 'vue';

export const UiState = reactive<Record<string, UiElemDto>>({})
