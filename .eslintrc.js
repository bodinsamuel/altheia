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
    ecmaFeatures: {
      impliedStrict: true,
    },
  },

  globals: {
    Promise: true,
  },

  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],

  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  plugins: ['jest', 'import', '@typescript-eslint', 'prettier'],

  // add your custom rules here
  rules: {
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-member-accessibility': [
      1,
      { accessibility: 'no-public' },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      1,
      { allowHigherOrderFunctions: true, allowTypedFunctionExpressions: false },
    ],

    // ---- import
    'import/extensions': ['error', 'never'],

    // ---- Disabled
    'no-await-in-loop': 'off',
    'no-underscore-dangle': 'off',
    'no-dupe-class-members': 'off',
    'no-restricted-globals': 'off',
    'no-continue': 'off',
    'class-methods-use-this': 'off',
    'import/no-cycle': 'off',
  },
  overrides: [
    {
      files: ['test/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
      },
    },
  ],
};
