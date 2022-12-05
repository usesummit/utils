const ABBREVIATIONS = Object.freeze({
    K: 1000,
    k: 1000,
    M: 1000,
    MM: 1000000,
    m: 1000000,
    mm: 1000000,
    B: 1000000000,
    b: 1000000000,
    T: 1000000000000,
    t: 1000000000000,
});

const isSupportedAbbreviation = (
    abbreviation: string
): abbreviation is keyof typeof ABBREVIATIONS =>
    Object.keys(ABBREVIATIONS).includes(abbreviation);

type ParseHumanReadableNumberOptions = {
    decimalSeparator?: '.' | ',';
    thousandsSeparator?: '.' | ',';
};

const defaultOptions = {
    decimalSeparator: '.',
    thousandsSeparator: ',',
};

export default function parseHumanReadableNumber(
    raw: string,
    options?: ParseHumanReadableNumberOptions
): number {
    const { decimalSeparator, thousandsSeparator } = {
        ...defaultOptions,
        ...options,
    };

    if (decimalSeparator === thousandsSeparator) {
        throw new Error(
            `Decimal separator and thousands separator cannot be the same: ${decimalSeparator}`
        );
    }

    const regex = new RegExp(
        `^(-)?((?:[0-9]{1,})(?:[_${thousandsSeparator}][0-9]{3})*)?(?:\\${decimalSeparator}((?:[0-9]{1,})(?:_[0-9]{3})*))?(${Object.keys(
            ABBREVIATIONS
        ).join('|')})?$`
    );

    const match = raw.match(regex);

    if (!match) {
        throw new Error('Invalid format for ' + raw);
    }

    const [, negative, rawInteger = '0', rawFraction = '', abbreviation] =
        match;

    const integerWithoutSeparator = rawInteger.replace(
        new RegExp(`[_${thousandsSeparator}]`, 'g'),
        ''
    );

    const fractionWithoutSeparator = rawFraction
        ? rawFraction.replace(/_/g, '')
        : '';

    const integer = parseInt(integerWithoutSeparator, 10);
    const fraction = rawFraction
        ? parseInt(fractionWithoutSeparator, 10)
        : null;

    const number =
        (negative ? -1 : 1) *
        (integer +
            (fraction
                ? fraction / Math.pow(10, fractionWithoutSeparator.length)
                : 0));

    if (abbreviation) {
        if (isSupportedAbbreviation(abbreviation)) {
            return number * ABBREVIATIONS[abbreviation];
        } else {
            throw new Error('Unsupported abbreviation ' + abbreviation);
        }
    }

    return number;
}
