import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  // global ignores (replaces .eslintignore)
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.vscode/**', 'coverage/**'],
  },

  // TypeScript source files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      // browser + node globals available in sources
      globals: {
        window: 'readable',
        document: 'readable',
        globalThis: 'readable',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },

    // recommended + stricter TS rules
    rules: {
      // general
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-duplicate-imports': 'error',

      // import plugin
      'import/order': ['error', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/*.test.*', 'tools/**', 'scripts/**'] },
      ],
      'import/no-cycle': ['error', { maxDepth: 1 }],

      // prettier
      'prettier/prettier': 'error',

      // TypeScript specifics
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-readonly': ['warn', { onlyInlineLambdas: true }],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],

      // naming (basic)
      '@typescript-eslint/naming-convention': [
        'warn',
        { selector: 'variableLike', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
        { selector: 'typeLike', format: ['PascalCase'] },
      ],

      // discourage using '@types' alias (project-specific)
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@types', message: "Don't use '@types' alias — rename to '@shared-types'." },
          ],
          patterns: [
            { group: ['@types/*'], message: "Don't use '@types/*' — rename to '@shared-types/*'." },
          ],
        },
      ],
    },
  },

  // JavaScript files (build scripts, config)
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
    },
  },

  // Tests / tooling overrides
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'tests/**'],
    languageOptions: {
      globals: { jest: 'readonly' },
    },
    rules: {
      // relax certain rules for tests
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Node scripts / config files (allow require, commonjs patterns if any)
  {
    files: ['scripts/**', 'tools/**', 'webpack.config.*', 'vite.config.*'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { process: 'readonly', __dirname: 'readonly' },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
]);
