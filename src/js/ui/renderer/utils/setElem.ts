import {onBeforeUnmount, onMounted, type TemplateRef} from 'vue';
import type {DomElement} from '@/ui/entities/abstract/DomElement.ts';
import type {MaybeReactive} from '@/utils/types.ts';

export function setElem(elem: TemplateRef<HTMLElement>, entity: MaybeReactive<DomElement>) {
    onMounted(() => entity.element.element = elem?.value ?? undefined);
    onBeforeUnmount(() => entity.element.element = undefined);
}