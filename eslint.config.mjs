import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import TsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  pluginJs.configs.recommended,
  {
    settings: {
      importResolver: {
        node: {
          paths: ['src'],
          extensions: ['.js', '.ts'],
        },
        alias: {
          map: [
            ['@', './src'],
            ['@entities', './src/entities/'],
            ['@routes', './src/api/routes'],
            ['@middlewares', './src/api/middlewares/'],
          ],
          extensions: ['.js', '.ts'],
        },
      },
      ignores: ['node_modules', 'dist', 'build'],
      plugins: {
        '@typescript-eslint': TsPlugin,
        prettier,
      },
      rules: {
        'prettier/prettier': 'error',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'no-console': 'error',
        'sort-imports': [
          'error',
          {
            ignoreCase: false,
            ignoreDeclarationSort: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            allowSeparatedGroups: false,
          },
        ],
        'no-empty': [
          'error',
          {
            allowEmptyCatch: true,
          },
        ],
      },
    },
  },
  ...tseslint.configs.recommended,
]
