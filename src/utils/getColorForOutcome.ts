const COLORS = [
    '--c-green',
    '--c-red',
    '--c-light-purple',
    '--c-pink',
    '--c-purple',
    '--c-blue',
    '--c-medium-blue',
    '--c-dark-purple',
];

export function getColorForOutcome(outcomeId: number, isScalar = false) {
    if (isScalar && outcomeId === 0) {
        return COLORS[1];
    }

    if (isScalar && outcomeId === 1) {
        return COLORS[0];
    }


    return COLORS[outcomeId];
}
