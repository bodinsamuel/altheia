// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: false,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    Promise: true,
  },
  plugins: ['jest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-member-accessibility': [
      1,
      { accessibility: 'no-public' },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      1,
      { allowHigherOrderFunctions: true, allowTypedFunctionExpressions: true },
    ],
  },
  overrides: [
    {
      files: ['test/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
};
