import { test, expect } from '@jest/globals';

import getIdentifier from './getIdentifier';

test('tracks an identifier for subsequent calls', () => {
    const [get, set, reset] = getIdentifier('abc');

    const firstValue = get();

    expect(get()).toBe(firstValue);
    expect(get()).toBe(firstValue);
    expect(get()).toBe(firstValue);
});

test('can be set to an initial value', () => {
    const [get, set, reset] = getIdentifier('def', 'initialValue');

    expect(get()).toBe('initialValue');
    expect(get()).toBe('initialValue');
    expect(get()).toBe('initialValue');
});

test('can be set to a value whenever', () => {
    const [get, set, reset] = getIdentifier('ghi', 'initialValue');

    const firstValue = get();

    expect(get()).toBe(firstValue);
    set('newValue');
    expect(get()).toBe('newValue');
});

test('can be reset to a new value', () => {
    const [get, set, reset] = getIdentifier('jkl');

    const firstValue = get();

    expect(get()).toBe(firstValue);

    reset();

    expect(get()).not.toBe(firstValue);

    const secondValue = get();
    expect(get()).toBe(secondValue);
});

test('can be reset to the initial value', () => {
    const [get, set, reset] = getIdentifier('mno', 'initialValue');

    expect(get()).toBe('initialValue');

    set('newValue');

    expect(get()).toBe('newValue');

    reset();

    expect(get()).not.toBe('newValue');
    expect(get()).toBe('initialValue');
});
