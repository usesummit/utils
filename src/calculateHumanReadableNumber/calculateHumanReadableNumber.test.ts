import { test, expect } from '@jest/globals';

import calculateHumanReadableNumber from './calculateHumanReadableNumber';

test('can format human readable numbers', () => {
    expect(calculateHumanReadableNumber(0.5, 0.25)).toEqual([0.5, null]);
    expect(calculateHumanReadableNumber(500)).toEqual([500, null]);
    expect(calculateHumanReadableNumber(123000)).toEqual([123, 'K']);
    expect(calculateHumanReadableNumber(123456)).toEqual([123.456, 'K']);
    expect(calculateHumanReadableNumber(1_234_567.89)).toEqual([
        expect.closeTo(1.23456789),
        'MM',
    ]);
    expect(calculateHumanReadableNumber(12_345_678.9)).toEqual([
        expect.closeTo(12.3456789),
        'MM',
    ]);
    expect(calculateHumanReadableNumber(123_456_789)).toEqual([
        expect.closeTo(123.456789),
        'MM',
    ]);
});

test('allows custom threshold', () => {
    expect(calculateHumanReadableNumber(500, 0.25)).toEqual([0.5, 'K']);
    expect(calculateHumanReadableNumber(500, 0.75)).toEqual([500, null]);
    expect(calculateHumanReadableNumber(123000, 0.25)).toEqual([123, 'K']);
    expect(calculateHumanReadableNumber(250000, 0.25)).toEqual([0.25, 'MM']);
    expect(calculateHumanReadableNumber(123456, 0.25)).toEqual([123.456, 'K']);
    expect(calculateHumanReadableNumber(123_456_789, 0.25)).toEqual([
        expect.closeTo(123.456789),
        'MM',
    ]);
    expect(calculateHumanReadableNumber(625_456_789, 0.625)).toEqual([
        expect.closeTo(0.625456789),
        'B',
    ]);
});

test('allows custom, per-abbrevation threshold', () => {
    expect(calculateHumanReadableNumber(500, { K: 0.25 })).toEqual([0.5, 'K']);
    expect(calculateHumanReadableNumber(250000, { K: 0.25 })).toEqual([
        250,
        'K',
    ]);
});
