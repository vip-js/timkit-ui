const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const nextPlugin = require('@next/eslint-plugin-next')
const prettierConfig = require('eslint-config-prettier')

module.exports = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'dist/**',
      'packages/**/dist/**',
      '**/*.d.ts',
      '**/.next/**',
      '.next/**',
      'apps/**/.next/**',
      'apps/docs/.next/**',
      '**/registry/**',
      '**/public/**',
      '**/previews/**',
      'apps/docs/registry/**',
      'apps/docs/public/**',
      'apps/docs/previews/**',
      'registry/**',
      'packages/vue/packages/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.cache/**',
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: '18.0',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSUnknownKeyword',
          message: 'Use explicit structural types instead of unknown.',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  prettierConfig,
  {
    files: ['apps/docs/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...(nextPlugin.configs.recommended?.rules ?? {}),
      ...(nextPlugin.configs['core-web-vitals']?.rules ?? {}),
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
]
