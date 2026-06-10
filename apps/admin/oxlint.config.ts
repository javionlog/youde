import { defineConfig } from 'oxlint'
import baseConfig from '../../oxlint.base.ts'
import fs from 'node:fs'
import path from 'node:path'

// Auto-read globals from unplugin-auto-import generated .d.ts, no manual maintenance needed
function loadAutoImportGlobals() {
  const dtsPath = path.resolve(import.meta.dirname, 'types/auto-imports.d.ts')
  const content = fs.readFileSync(dtsPath, 'utf-8')
  const names = [...content.matchAll(/^\s+const (\w+):/gm)].map(m => m[1])
  return Object.fromEntries(names.map(name => [name, 'readonly' as const]))
}

export default defineConfig({
  extends: [baseConfig],
  ignorePatterns: ['public', 'src/global/api', 'types/auto-imports.d.ts'],
  globals: loadAutoImportGlobals()
})
