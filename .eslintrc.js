module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended', 'prettier'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'no-use-before-define': ['error', { functions: false, classes: false }],
    'arrow-body-style': 0,
    radix: ['error', 'as-needed'],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'jest/prefer-expect-assertions': 'error',
    'linebreak-style': 0,
    'implicit-arrow-linebreak': 0,
    'arrow-parens': 0,
    'comma-dangle': 0,
    'operator-linebreak': 0,
    'object-curly-newline': 0,
    'consistent-return': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    parserOptions: {
      ecmaVersion: 2017
    },
    'function-paren-newline': 0,
    'space-before-function-paren': 0,
    'prettier/prettier': 'error',
    quotes: 0
  },
  plugins: ['jest', 'prettier']
};
