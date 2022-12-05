module.exports = {
    root: true,
    env: {
        browser: false,
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:import/recommended',
        'plugin:import/typescript',
    ],
    parserOptions: {
        sourceType: 'module',
    },
    settings: {
        'import/extensions': ['.js', '.ts'],
    },
    overrides: [
        {
            files: ['./src/*.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            rules: {
                'no-undef': 'off',
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': ['error'],
                'no-shadow': 'off',
                '@typescript-eslint/no-shadow': ['error'],
            },
        },
        {
            files: ['.eslintrc.js', './*.config.js'],
            env: {
                browser: false,
                node: true,
            },
        },
    ],
};
