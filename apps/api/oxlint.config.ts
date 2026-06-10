import { defineConfig } from 'oxlint'
import baseConfig from '../../oxlint.base.ts'

export default defineConfig({
  extends: [baseConfig],
  ignorePatterns: ['public', 'src/global/api', 'types/auto-imports.d.ts']
})
