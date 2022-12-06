import { v4 as uuid } from 'uuid';

type CacheGetter = () => string;
type CacheSetter = (newValue: string | undefined) => void;
type CacheResetter = () => void;

const defaultStorage = (function () {
    if (globalThis.sessionStorage) {
        return globalThis.sessionStorage;
    }

    let store: Record<string, string> = {};

    return {
        getItem(key: string) {
            return store[key];
        },
        setItem(key: string, value: string) {
            store[key] = value;
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key(n: number) {
            return Object.keys(store)[n];
        },
    };
})();

export default function getIdentifier(
    key: string,
    initialValue?: string,
    storage: Storage = defaultStorage
): [CacheGetter, CacheSetter, CacheResetter] {
    let inMemory = initialValue || uuid();

    return [
        () => {
            try {
                const fromStorage = storage.getItem(key);

                if (fromStorage) {
                    return fromStorage;
                }

                storage.setItem(key, inMemory);
            } catch (e) {
                try {
                    // Just in case the error wasn't related to the storage's availability,
                    // we might be able to recover so we can link some sessions together
                    storage.setItem(key, inMemory);
                } catch (saveError) {
                    // Do nothing
                }
            }

            return inMemory;
        },
        (newValue) => {
            if (newValue) {
                inMemory = newValue;

                try {
                    storage.setItem(key, newValue);
                } catch (e) {
                    // Do nothing
                }
            } else {
                inMemory = uuid();

                try {
                    storage.removeItem(key);
                } catch (e) {
                    // Do nothing
                }
            }
        },
        () => {
            inMemory = initialValue || uuid();

            try {
                storage.removeItem(key);
                // The next run of the getter will store the new value
            } catch (e) {
                // Do nothing
            }
        },
    ];
}
