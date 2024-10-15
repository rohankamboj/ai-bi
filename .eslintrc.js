module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    plugins: ['react', '@typescript-eslint'],
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    settings: {
      react: { version: 'detect' },
    },
  };
  