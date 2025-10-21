export function floor(number: number, precision: number = 2) {
    const multiplier = 10 ** precision;
    return Math.floor(number * multiplier) / multiplier;
}

export function lerpInterval(
    value: number,
    fromLow: number,
    fromHigh: number,
    toLow: number = -1,
    toHigh: number = 1,
    precision: number|false = 2
): number {
    const result = toLow + (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow);
    return precision === false ? result : floor(result, precision);
}