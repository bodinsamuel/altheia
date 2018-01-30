// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    env: {
        browser: false,
        es6: true,
        node: true
    },
    parserOptions: {
        'ecmaVersion': 8,
    },
    'globals': {
        'Promise': true,
        'Sequelize': true
    },
    // add your custom rules here
    'rules': {
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        // Copy airbnB
        'accessor-pairs': 'off',
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'complexity': ['off', 10],
        'consistent-return': 'error',
        'curly': 'error',
        'dot-notation': ['error', { allowKeywords: true }],
        'dot-location': ['error', 'property'],
        'eqeqeq': ['error', 'always', { null: 'ignore' }],
        'guard-for-in': 'error',
        'no-alert': 'warn',
        'no-case-declarations': 'error',
        'no-div-regex': 'off',
        'no-else-return': 'error',
        'no-empty-function': ['error', {
            'allow': [
                'arrowFunctions',
                'functions',
                'methods',
            ]
        }],
        'no-empty-pattern': 'error',
        'no-eq-null': 'off',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-fallthrough': 'error',
        'no-floating-decimal': 'error',
        'no-global-assign': ['error', { exceptions: [] }],
        'no-implicit-coercion': ['off', {
            'boolean': false,
            'number': true,
            'string': true,
            'allow': [],
        }],
        'no-implicit-globals': 'off',
        'no-implied-eval': 'error',
        'no-invalid-this': 'off',
        'no-iterator': 'error',
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-proto': 'error',
        'no-redeclare': 'error',
        'no-return-assign': 'error',
        'no-script-url': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unused-expressions': ['error', {
            'allowShortCircuit': false,
            'allowTernary': false,
            'allowTaggedTemplates': false,
        }],
        'no-unused-labels': 'error',
        'no-useless-call': 'off',
        'no-useless-concat': 'error',
        'no-useless-escape': 'error',
        'no-useless-return': 'error',
        'no-void': 'error',
        'no-with': 'error',
        'prefer-promise-reject-errors': ['off', { allowEmptyReject: true }],
        'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],
        'yoda': 'error',

        /* error */
        'comma-dangle': ['error', {
            arrays: 'never',
            objects: 'never',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
        }],
        'no-cond-assign': ['error', 'always'],
        'no-debugger': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty': 'error',
        'no-ex-assign': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-parens': ['off', 'all', {
            'conditionalAssign': true,
            'nestedBinaryExpressions': false,
            'returnAssign': false,
        }],
        'no-extra-semi': 'error',
        'no-func-assign': 'error',
        'no-inner-declarations': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-obj-calls': 'error',
        'no-prototype-builtins': 'error',
        'no-template-curly-in-string': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'no-unsafe-negation': 'error',
        'use-isnan': 'error',
        'valid-jsdoc': 'off',
        'valid-typeof': ['error', { requireStringLiterals: true }],

        /* es6 */
        'arrow-parens': ['error', 'as-needed', {
            requireForBlockBody: true,
        }],
        'arrow-spacing': ['error', { before: true, after: true }],
        'constructor-super': 'error',
        'generator-star-spacing': ['error', { before: false, after: true }],
        'no-class-assign': 'error',
        'no-confusing-arrow': ['error', {
            allowParens: true,
        }],
        'no-dupe-class-members': 'error',
        'no-duplicate-imports': 'off',
        'no-new-symbol': 'error',
        'no-restricted-imports': 'off',
        'no-this-before-super': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'prefer-const': ['error', {
            destructuring: 'any',
            ignoreReadBeforeAssign: true,
        }],
        'template-curly-spacing': 'error',

        /* style */
        'array-bracket-spacing': ['error', 'never'],
        'block-spacing': ['error', 'always'],
        'brace-style': ['error', '1tbs', { allowSingleLine: false }],
        'camelcase': ['error', { properties: 'never' }],
        'comma-spacing': ['error', { before: false, after: true }],
        'comma-style': ['error', 'last'],
        'computed-property-spacing': ['error', 'never'],
        'eol-last': ['error', 'always'],
        'func-call-spacing': 'error',
        'id-blacklist': 'off',
        'indent': ['error', 2, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            FunctionDeclaration: {
                parameters: 1,
                body: 1
            },
            FunctionExpression: {
                parameters: 1,
                body: 1
            }
        }],
        'key-spacing': ['error', { beforeColon: false, afterColon: true }],
        'keyword-spacing': ['error', {
            before: true,
            after: true,
            overrides: {
                return: { after: true },
                throw: { after: true },
                case: { after: true }
            }
        }],
        'linebreak-style': ['error', 'unix'],
        'max-depth': ['off', 4],
        'max-len': ['error', 120, 2, {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
        'max-params': ['off', 5],
        'max-statements': ['off', 10],
        'multiline-ternary': ['off', 'never'],
        'new-cap': ['error', {
            newIsCap: true,
            newIsCapExceptions: [],
            capIsNew: false,
            capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
        }],
        'new-parens': 'error',
        'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
        'no-lonely-if': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multi-assign': ['error'],
        'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
        'no-nested-ternary': 'error',
        'no-new-object': 'error',
        'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
        'no-spaced-func': 'error',
        'no-tabs': 'error',
        'no-ternary': 'off',
        'no-trailing-spaces': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-whitespace-before-property': 'error',
        'object-curly-spacing': ['error', 'always'],
        'one-var-declaration-per-line': ['error', 'always'],
        'padded-blocks': ['error', 'never'],
        'quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],
        quotes: ['error', 'single', { avoidEscape: true }],
        'require-jsdoc': 'off',
        semi: ['error','always'],
        'space-before-function-paren': ['error','never'],


        strict: ['error', 'never'],
        'no-delete-var': 'error',
        'no-label-var': 'error',
        'no-undef': 'error',
        // End airbnb

    }
}
