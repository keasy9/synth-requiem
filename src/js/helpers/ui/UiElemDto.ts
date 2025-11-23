import type {AnyUiAnchor} from '@/helpers/ui/UiElemBuilder.ts';
import {UiAnchor} from '@/helpers/ui/UiElemBuilder.ts';

export abstract class UiElemDto {
    public anchor: AnyUiAnchor = UiAnchor.Center;
}