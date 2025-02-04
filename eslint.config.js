import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
   { ignores: ['dist'] },
   {
      files: ['**/*.{js,jsx,ts,tsx}'],
      languageOptions: {
         parser: typescriptParser,
         ecmaVersion: 2020,
         globals: globals.browser,
         parserOptions: {
            ecmaVersion: 'latest',
            ecmaFeatures: { jsx: true },
            sourceType: 'module',
            project: './tsconfig.json',
         },
      },
      settings: { react: { version: '19' } },
      plugins: {
         react,
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
         import: importPlugin,
         'unused-imports': unusedImports,
         prettier: prettier,
         '@typescript-eslint': typescriptPlugin,
      },
      rules: {
         ...js.configs.recommended.rules,
         ...react.configs.recommended.rules,
         ...react.configs['jsx-runtime'].rules,
         ...reactHooks.configs.recommended.rules,
         ...typescriptPlugin.configs.recommended.rules,
         '@typescript-eslint/no-unused-vars': [
            'warn',
            {
               vars: 'all',
               varsIgnorePattern: '^_',
               args: 'after-used',
               argsIgnorePattern: '^_',
            },
         ],
         'react/jsx-no-target-blank': 'off',
         'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
         'import/order': [
            'error',
            {
               groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
               'newlines-between': 'always',
               alphabetize: {
                  order: 'asc',
                  caseInsensitive: true,
               },
            },
         ],
         'unused-imports/no-unused-imports': 'error',
         'prettier/prettier': 'error',
         quotes: ['error', 'single'],
         'jsx-quotes': ['error', 'prefer-single'],
      },
   },
];
