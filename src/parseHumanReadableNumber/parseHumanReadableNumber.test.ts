import { test, expect } from '@jest/globals';

import parseHumanReadableNumber from './parseHumanReadableNumber';

test('does not require a leading zero for decimals', () => {
    expect(parseHumanReadableNumber('.5')).toBeCloseTo(0.5);
    expect(parseHumanReadableNumber('.5K')).toBe(500);
    expect(parseHumanReadableNumber('.123MM')).toBe(123000);
    expect(parseHumanReadableNumber('.123456MM')).toBe(123456);
});

test('parses human readable numbers', () => {
    expect(parseHumanReadableNumber('1')).toBe(1);
    expect(parseHumanReadableNumber('1K')).toBe(1000);
    expect(parseHumanReadableNumber('1k')).toBe(1000);
    expect(parseHumanReadableNumber('1M')).toBe(1000);
    expect(parseHumanReadableNumber('1MM')).toBe(1_000_000);
    expect(parseHumanReadableNumber('1m')).toBe(1_000_000);
    expect(parseHumanReadableNumber('1mm')).toBe(1_000_000);
    expect(parseHumanReadableNumber('1B')).toBe(1_000_000_000);
    expect(parseHumanReadableNumber('1b')).toBe(1_000_000_000);
    expect(parseHumanReadableNumber('1T')).toBe(1_000_000_000_000);
    expect(parseHumanReadableNumber('1t')).toBe(1_000_000_000_000);
    expect(parseHumanReadableNumber('4.2')).toBe(4.2);
    expect(parseHumanReadableNumber('4.2K')).toBe(4200);
    expect(parseHumanReadableNumber('4.2k')).toBe(4200);
    expect(parseHumanReadableNumber('4.2M')).toBe(4200);
    expect(parseHumanReadableNumber('4.2MM')).toBe(4_200_000);
    expect(parseHumanReadableNumber('4.2m')).toBe(4_200_000);
    expect(parseHumanReadableNumber('4.2mm')).toBe(4_200_000);
    expect(parseHumanReadableNumber('4.2B')).toBe(4_200_000_000);
    expect(parseHumanReadableNumber('4.2b')).toBe(4_200_000_000);
    expect(parseHumanReadableNumber('4.2T')).toBe(4_200_000_000_000);
    expect(parseHumanReadableNumber('4.2t')).toBe(4_200_000_000_000);
    expect(parseHumanReadableNumber('1337_133')).toBe(1337_133);
    expect(parseHumanReadableNumber('1_332.512K')).toBe(1332512);
    expect(parseHumanReadableNumber('4.500_000k')).toBe(4500);
    expect(parseHumanReadableNumber('4.2M')).toBe(4200);
    expect(parseHumanReadableNumber('4.2MM')).toBe(4_200_000);
    expect(parseHumanReadableNumber('4.2m')).toBe(4_200_000);
    expect(parseHumanReadableNumber('4.2mm')).toBe(4_200_000);
    expect(parseHumanReadableNumber('4.2B')).toBe(4_200_000_000);
    expect(parseHumanReadableNumber('4.2b')).toBe(4_200_000_000);
    expect(parseHumanReadableNumber('4.2T')).toBe(4_200_000_000_000);
    expect(parseHumanReadableNumber('4.2t')).toBe(4_200_000_000_000);
});

test('parses thousands separators', () => {
    expect(parseHumanReadableNumber('1')).toBe(1);
    expect(parseHumanReadableNumber('1_000')).toBe(1000);
    expect(parseHumanReadableNumber('1,000')).toBe(1000);
    expect(parseHumanReadableNumber('1_000_000')).toBe(1_000_000);
    expect(parseHumanReadableNumber('1,000,000')).toBe(1_000_000);
    expect(parseHumanReadableNumber('1_000_000,000')).toBe(1_000_000_000);
    expect(parseHumanReadableNumber('1,000,000,000')).toBe(1_000_000_000);
    expect(parseHumanReadableNumber('1_000_000_000_000')).toBe(
        1_000_000_000_000
    );
    expect(parseHumanReadableNumber('1,000,000,000,000')).toBe(
        1_000_000_000_000
    );
    expect(parseHumanReadableNumber('4.2')).toBeCloseTo(4.2);
    expect(() => parseHumanReadableNumber('4,2')).toThrow();
    expect(parseHumanReadableNumber('1337_133')).toBe(1337_133);
    expect(parseHumanReadableNumber('1,332.512K')).toBe(1332512);
    expect(parseHumanReadableNumber('4.500_000k')).toBe(4500);
    expect(() => parseHumanReadableNumber('4.500,000k')).toThrow();

    expect(
        parseHumanReadableNumber('1.000', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(1000);
    expect(
        parseHumanReadableNumber('1.000.000', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(1_000_000);
    expect(
        parseHumanReadableNumber('1.000.000.000', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(1_000_000_000);
    expect(
        parseHumanReadableNumber('1.000.000.000.000', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(1_000_000_000_000);
    expect(
        parseHumanReadableNumber('4,2', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(4.2);
    expect(() =>
        parseHumanReadableNumber('4.2', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toThrow();
    expect(
        parseHumanReadableNumber('1.332,512K', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(1332512);
    expect(
        parseHumanReadableNumber('4,500_000k', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toBe(4500);
    expect(() =>
        parseHumanReadableNumber('4,500.000k', {
            thousandsSeparator: '.',
            decimalSeparator: ',',
        })
    ).toThrow();
});

test('throws on invalid numbers', () => {
    expect(() => parseHumanReadableNumber('potato')).toThrow();
});

test('throws when thousands and decimal separator is the same', () => {
    expect(() =>
        parseHumanReadableNumber('123,456.768', {
            decimalSeparator: ',',
            thousandsSeparator: ',',
        })
    ).toThrow();

    expect(() =>
        parseHumanReadableNumber('123,456.768', {
            decimalSeparator: '.',
            thousandsSeparator: '.',
        })
    ).toThrow();
});

test('parses human readable negative numbers', () => {
    expect(parseHumanReadableNumber('-1')).toBe(-1);
    expect(parseHumanReadableNumber('-1K')).toBe(-1000);
    expect(parseHumanReadableNumber('-1k')).toBe(-1000);
    expect(parseHumanReadableNumber('-1M')).toBe(-1000);
    expect(parseHumanReadableNumber('-1MM')).toBe(-1_000_000);
    expect(parseHumanReadableNumber('-1m')).toBe(-1_000_000);
    expect(parseHumanReadableNumber('-1mm')).toBe(-1_000_000);
    expect(parseHumanReadableNumber('-1B')).toBe(-1_000_000_000);
    expect(parseHumanReadableNumber('-1b')).toBe(-1_000_000_000);
    expect(parseHumanReadableNumber('-1T')).toBe(-1_000_000_000_000);
    expect(parseHumanReadableNumber('-1t')).toBe(-1_000_000_000_000);
    expect(parseHumanReadableNumber('-4.2')).toBeCloseTo(-4.2);
    expect(parseHumanReadableNumber('-4.2K')).toBe(-4200);
    expect(parseHumanReadableNumber('-4.2k')).toBe(-4200);
    expect(parseHumanReadableNumber('-4.2M')).toBe(-4200);
    expect(parseHumanReadableNumber('-4.2MM')).toBe(-4_200_000);
    expect(parseHumanReadableNumber('-4.2m')).toBe(-4_200_000);
    expect(parseHumanReadableNumber('-4.2mm')).toBe(-4_200_000);
    expect(parseHumanReadableNumber('-4.2B')).toBe(-4_200_000_000);
    expect(parseHumanReadableNumber('-4.2b')).toBe(-4_200_000_000);
    expect(parseHumanReadableNumber('-4.2T')).toBe(-4_200_000_000_000);
    expect(parseHumanReadableNumber('-4.2t')).toBe(-4_200_000_000_000);
    expect(parseHumanReadableNumber('-1337_133')).toBe(-1337_133);
    expect(parseHumanReadableNumber('-1_332.512K')).toBe(-1332512);
    expect(parseHumanReadableNumber('-4.500_000k')).toBe(-4500);
    expect(parseHumanReadableNumber('-4.2M')).toBe(-4200);
    expect(parseHumanReadableNumber('-4.2MM')).toBe(-4_200_000);
    expect(parseHumanReadableNumber('-4.2m')).toBe(-4_200_000);
    expect(parseHumanReadableNumber('-4.2mm')).toBe(-4_200_000);
    expect(parseHumanReadableNumber('-4.2B')).toBe(-4_200_000_000);
    expect(parseHumanReadableNumber('-4.2b')).toBe(-4_200_000_000);
    expect(parseHumanReadableNumber('-4.2T')).toBe(-4_200_000_000_000);
    expect(parseHumanReadableNumber('-4.2t')).toBe(-4_200_000_000_000);
});
