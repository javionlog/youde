import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['public', 'node_modules', 'src/global/api', 'types/auto-imports.d.ts'],
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  sortTailwindcss: true
})
