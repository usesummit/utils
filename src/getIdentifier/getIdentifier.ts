import { v4 as uuid } from '@lukeed/uuid';

type CacheGetter = () => string;
type CacheSetter = (newValue: string | undefined) => void;
type CacheResetter = () => void;

const defaultStorage = (function () {
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
    storage?: 'localStorage' | 'sessionStorage' | Storage
): [CacheGetter, CacheSetter, CacheResetter] {
    let inMemory = initialValue || uuid();

    let actualStorage = (() => {
        if (!storage) {
            return defaultStorage;
        }

        try {
            const storageObject = (() => {
                if (storage === 'localStorage') {
                    return globalThis.localStorage;
                }

                if (storage === 'sessionStorage') {
                    return globalThis.sessionStorage;
                }

                return storage;
            })();

            storageObject.setItem('test', 'test');
            storageObject.removeItem('test');

            return storageObject;
        } catch (e) {
            return defaultStorage;
        }
    })();

    return [
        // Getter
        () => {
            const fromStorage = actualStorage.getItem(key);

            if (fromStorage) {
                return fromStorage;
            }

            try {
                actualStorage.setItem(key, inMemory);
            } catch (e) {
                // This is most probably a quota error
                // Let's revert to the default in-memory storage
                actualStorage = defaultStorage;
                actualStorage.setItem(key, inMemory);
            }

            return inMemory;
        },

        // Setter
        (newValue) => {
            if (newValue) {
                inMemory = newValue;

                try {
                    actualStorage.setItem(key, newValue);
                } catch (e) {
                    actualStorage = defaultStorage;
                    actualStorage.setItem(key, inMemory);
                }
            } else {
                inMemory = uuid();
                actualStorage.removeItem(key);
            }
        },

        // Resetter
        () => {
            inMemory = initialValue || uuid();

            actualStorage.removeItem(key);
            // The next run of the getter will store the new value
        },
    ];
}
