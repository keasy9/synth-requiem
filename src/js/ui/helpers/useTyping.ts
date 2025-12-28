import {computed, type MaybeRefOrGetter, ref, toValue} from 'vue';

export function useTyping(text: MaybeRefOrGetter<string> = '', speed: number = 50, step: number = 1) {
    let nextSymbolIndex = 0;
    const interval = ref<number|null>(null);
    const isTyping = computed<boolean>(() => !!interval.value);
    const typedText = ref<string>('');

    function end() {
        if (interval.value) {
            clearInterval(interval.value);
            interval.value = null;
        }

        nextSymbolIndex = 0;
        typedText.value = toValue(text);
    }

    function typeSymbol() {
        // todo поддержка вложенных html-элементов
        if (!interval.value) return;

        if (nextSymbolIndex >= toValue(text).length) {
            end();
            return;
        }

        typedText.value += toValue(text)[nextSymbolIndex];
        nextSymbolIndex += step;
    }

    function start() {
        if (interval.value) end();
        typedText.value = '';
        interval.value = setInterval(typeSymbol, speed);
    }

    return {
        isTyping,
        typedText,
        start,
        end,
    };
}