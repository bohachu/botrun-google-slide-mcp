import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      "arrow-body-style": ["warn", "as-needed"],
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'error',
      "import/no-unresolved": "off",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-self-import": "error",
      "import/no-cycle": "warn",
      "import/no-useless-path-segments": "warn",
      "prettier/prettier": "error"
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
];
