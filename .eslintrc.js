module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'import',
  ],

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'airbnb-typescript/base',
    'airbnb-typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'simple-import-sort/imports': 2,
    'react/react-in-jsx-scope': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/consistent-type-imports': 1,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      1,
      { argsIgnorePattern: '^_', vars: 'all', args: 'after-used' },
    ],

    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: {
            message: 'Avoid using the `Object` type. Did you mean `object`?',
          },
          Function: {
            message:
              'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
          },
          Boolean: {
            message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
            fixWith: 'boolean',
          },
          Number: {
            message: 'Avoid using the `Number` type. Did you mean `number`?',
            fixWith: 'number',
          },
          Symbol: {
            message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
            fixWith: 'symbol',
          },
          String: {
            message: 'Avoid using the `String` type. Did you mean `string`?',
            fixWith: 'string',
          },
          '{}': {
            message: 'Use Record<string, any> instead',
            fixWith: 'Record<string, any>',
          },
          object: {
            message: 'Use Record<string, any> instead',
            fixWith: 'Record<string, any>',
          },
        },
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        overrides: {
          constructors: 'off',
        },
      },
    ],

    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],

    'max-len': [
      'warn',
      {
        code: 150,
      },
    ],

    'prefer-template': 2,
    'prefer-destructuring': 2,
    'object-shorthand': 2,
    curly: 2,
    'react/jsx-filename-extension': 0,

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],
    'prettier/prettier': 0,
  },
};
