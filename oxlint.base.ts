import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'react',
    'react-perf',
    'oxc',
    'import',
    'jsx-a11y',
    'promise'
  ],
  ignorePatterns: ['public', 'node_modules', 'src/global/api', 'types/auto-imports.d.ts'],
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'error'
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'react/exhaustive-deps': 'off'
        // 'typescript/no-explicit-any': 'off',
        // 'typescript/no-non-null-assertion': 'off',
      }
    }
  ]
})
