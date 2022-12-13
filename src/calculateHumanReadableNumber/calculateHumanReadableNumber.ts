const ABBREVIATIONS = Object.freeze({
    K: 1000,
    MM: 1_000_000,
    B: 1_000_000_000,
    T: 1_000_000_000_000,
});

const iterableAbbreviations = Object.entries(ABBREVIATIONS) as [
    Abbreviation,
    number
][];

type Abbreviation = keyof typeof ABBREVIATIONS;

const isSupportedAbbreviation = (
    abbreviation: string
): abbreviation is Abbreviation =>
    Object.keys(ABBREVIATIONS).includes(abbreviation);

const DEFAULT_THRESHOLD = 1;

export default function formatHumanReadableNumber(
    number: number,
    threshold:
        | number
        | Partial<Record<Abbreviation, number>> = DEFAULT_THRESHOLD
): [number, Abbreviation | null] {
    const thresholds = iterableAbbreviations.reduce(
        (acc, [abbreviation]) => ({
            ...acc,
            [abbreviation]:
                typeof threshold === 'number'
                    ? threshold
                    : threshold[abbreviation] ?? DEFAULT_THRESHOLD,
        }),
        {} as Record<Abbreviation, number>
    );

    const absNumber = Math.abs(number);
    const matchingAbbreviations = iterableAbbreviations.filter(
        ([abbreviation, value]) => absNumber >= thresholds[abbreviation] * value
    );

    if (matchingAbbreviations.length === 0) {
        return [number, null];
    }

    const [abbreviation] =
        matchingAbbreviations[matchingAbbreviations.length - 1];

    if (!isSupportedAbbreviation(abbreviation)) {
        return [number, null];
    }

    const numberWithoutAbbreviation = number / ABBREVIATIONS[abbreviation];

    return [numberWithoutAbbreviation, abbreviation];
}
