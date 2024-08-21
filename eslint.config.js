import eslintJsPlugin from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import nPlugin from 'eslint-plugin-n';
import unicornPlugin from 'eslint-plugin-unicorn';
import globals from 'globals';

const relativeImportsError = 'Instead of using relative imports, use `##/`.';

export default [
  eslintJsPlugin.configs.recommended,

  {
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
      n: nPlugin,
    },
    rules: {
      // Possible Errors
      'no-await-in-loop': 'error',
      'no-console': 'error',
      'no-prototype-builtins': 'warn',
      'no-template-curly-in-string': 'warn',

      // Best Practices
      semi: ['error', 'always'],
      'array-callback-return': 'warn',
      'block-scoped-var': 'error',
      complexity: 'off',
      curly: ['error', 'all'],
      'dot-notation': 'warn',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'warn',
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-div-regex': 'error',
      'no-empty-function': 'error',
      'no-eq-null': 'off',
      'no-eval': 'error',
      'no-extend-native': 'warn',
      'no-extra-bind': 'error',
      'no-extra-label': 'warn',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'off',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': ['error', { allowInParentheses: false }],
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'warn',
      'no-useless-return': 'warn',
      'no-void': 'error',
      'no-with': 'error',
      radix: ['warn', 'as-needed'],
      'require-await': 'error',
      yoda: 'warn',

      // Strict Mode
      strict: ['error', 'global'],

      // Variables
      'id-denylist': ['error', 'dispatch', 'e', 'ev', 'err'],
      'no-label-var': 'error',
      'no-shadow': [
        'warn',
        { allow: ['resolve', 'reject', 'done', 'cb', 'callback', 'err', 'res', 'i'] },
      ],
      'no-shadow-restricted-names': 'error',
      'no-undef-init': 'warn',
      'no-unused-vars': ['error', { args: 'none' }],
      'no-use-before-define': ['error', { functions: false }],

      // Node.js and CommonJS
      'global-require': 'error',
      'handle-callback-err': ['error', '^(e|err|error)$'],
      'no-buffer-constructor': 'error',
      'no-mixed-requires': 'warn',
      'no-new-require': 'error',
      'no-path-concat': 'error',
      'no-process-env': 'error',
      'no-sync': 'error',

      // Stylistic Issues
      'func-name-matching': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'max-depth': ['error', 4],
      'max-len': ['error', { code: 140 }],
      'max-lines': 'off',
      'max-nested-callbacks': 'error',
      'no-continue': 'off',
      'max-statements-per-line': ['error', { max: 2 }],
      'new-cap': ['error', { capIsNewExceptions: ['ObjectId'] }],
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-new-object': 'error',
      'no-tabs': 'error',
      'no-unneeded-ternary': 'error',
      'one-var': ['error', 'never'],
      'operator-assignment': 'warn',
      'padding-line-between-statements': 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
      'spaced-comment': ['error', 'always', { exceptions: ['/', '*'] }],

      // ECMAScript 6
      'no-duplicate-imports': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'properties'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'symbol-description': 'error',

      'require-atomic-updates': 'off',

      // Import rules
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: relativeImportsError,
            },
          ],
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          // Sort members within each `import` declaration, but leave sorting of
          // `import` declarations with respect to each other to `import/order`,
          // which supports sorting by module name.
          ignoreDeclarationSort: true,
        },
      ],
      'import/extensions': ['error', 'ignorePackages'],
      'import/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
        },
      ],
      'unicorn/prefer-node-protocol': 'error',

      // Export rules
      'import/group-exports': 'error',
      'import/exports-last': 'error',

      'n/callback-return': ['warn', ['callback', 'cb', 'next', 'primaryCallback']],
    },
  },

  {
    files: ['**/*.{,c}js'],
    ignores: ['##/config/lib/app.js', '##/config/config.js', '##/config/env/default.js'],
    rules: {
      'no-console': 'off', // Turn off 'no-console' rule for these files
      'no-process-env': 'off',
    },
    languageOptions: {
      globals: globals.node,
    },
  },
];
