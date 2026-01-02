import {onBeforeUnmount, onMounted, type TemplateRef} from 'vue';
import {UiElementsState} from '@/ui/State.ts';

export function setElem(elem: TemplateRef<HTMLElement>, entityId: number) {
    const entity = UiElementsState[entityId];
    if (entity) {
        onMounted(() => entity.element.element = elem?.value ?? undefined);
        onBeforeUnmount(() => entity.element.element = undefined);
    }
}