module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    env: {
        node: true
    },
    rules: {
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'eslint linebreak-style': [0, 'error', 'windows'],
        'no-undef': 0,
        'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 1 }],
        'max-len': ['warn', {
            code: 250,
            ignoreComments: true,
            ignoreStrings: true,
            ignorePattern: 'd=([s]*?)'
        }]
    }
}