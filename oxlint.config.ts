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
  ignorePatterns: ['public', 'node_modules'],
  rules: {
    'no-unused-vars': 'error',
    'no-console': 'error'
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // 'typescript/no-explicit-any': 'off',
        // 'typescript/no-non-null-assertion': 'off',
      }
    }
  ]
})
