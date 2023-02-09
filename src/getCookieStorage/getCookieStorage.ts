export type CookieOptions = {
    domain?: string | null;
    path?: string;
    secure?: boolean;
    sameSite?: 'Lax' | 'Strict' | 'None';
    maxAge?: number;
    expires?: Date | null;
};

export type CookieStorageOptions = CookieOptions & {
    prefix?: string;
};

const defaultOptions: CookieOptions = {
    domain: null,
    path: '/',
    secure: true,
    sameSite: 'Lax' as 'Lax' | 'Strict' | 'None',
    maxAge: 31536000,
    expires: null as Date | null,
};

export default function getCookieStorage(
    config: CookieStorageOptions
): Storage {
    const formatCookie = (
        key: string,
        value: string,
        overrides: Partial<CookieOptions> = {}
    ) => {
        const parsedConfig = {
            ...defaultOptions,
            ...config,
            ...overrides,
        };

        const encodedKey = encodeURIComponent(
            config.prefix ? `${config.prefix}_${key}` : key
        );
        const encodedValue = encodeURIComponent(value);

        const cookie = [`${encodedKey}=${encodedValue}`];

        if (parsedConfig.domain) {
            cookie.push(`Domain=${parsedConfig.domain}`);
        }

        if (parsedConfig.path) {
            cookie.push(`Path=${parsedConfig.path}`);
        }

        if (parsedConfig.secure) {
            cookie.push('Secure');
        }

        if (parsedConfig.sameSite) {
            cookie.push(`SameSite=${parsedConfig.sameSite}`);
        }

        // Explicitly defined maxAge takes precedence over expires
        if (config.maxAge) {
            cookie.push(`Max-Age=${config.maxAge}`);
        } else if (parsedConfig.expires) {
            cookie.push(`Expires=${parsedConfig.expires.toUTCString()}`);
        } else {
            // Fallback to maxAge (since default config will have that set to a year)
            cookie.push(`Max-Age=${parsedConfig.maxAge}`);
        }

        return cookie.join('; ');
    };

    let _parsedCache: Record<string, string> | null = null;

    const resetCache = () => {
        _parsedCache = null;
    };

    const getAll = () => {
        if (_parsedCache) {
            return _parsedCache;
        }

        _parsedCache = Object.fromEntries(
            document.cookie
                .split(';')
                .map(
                    (cookie) =>
                        cookie.trim().split('=').map(decodeURIComponent) as [
                            string,
                            string
                        ]
                )
                .map(([key, value]) => {
                    if (config.prefix) {
                        return [key.replace(`${config.prefix}_`, ''), value];
                    }

                    return [key, value];
                })
        );

        return _parsedCache;
    };

    return {
        getItem(key: string) {
            const value = getAll()[key];

            return value ? decodeURIComponent(value) : null;
        },
        setItem(key: string, value: string) {
            const cookie = formatCookie(key, value);
            document.cookie = cookie;
            resetCache();
        },
        removeItem(key: string) {
            const cookie = formatCookie(key, '', { expires: new Date(0) });
            document.cookie = cookie;
            resetCache();
        },
        clear: () => {
            Object.keys(getAll()).forEach((key) => {
                const cookie = formatCookie(key, '', { expires: new Date(0) });
                document.cookie = cookie;
            });

            resetCache();
        },
        get length() {
            return Object.keys(getAll()).length;
        },
        key(n: number) {
            return Object.keys(getAll())[n];
        },
    };
}
