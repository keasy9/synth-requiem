import type {Reactive} from 'vue';

export type EnumValue<Const extends {}> = Const[keyof Const];
export type MaybeReactive<T> = T|Reactive<T>;