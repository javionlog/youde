import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import unimport from 'unimport/unplugin'

const dirname = fileURLToPath(new URL('.', import.meta.url))

const getFinalEnv = (env: Record<string, string>, mode: string) => {
  const result = {} as ImportMetaEnv
  result.MODE = mode
  result.DEV = mode === 'dev'
  result.PROD = mode === 'prod'
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string' && ['true', 'false'].includes(value)) {
      result[key] = value === 'true'
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      result[key] = Number(value)
    } else {
      result[key] = value
    }
  }
  return result
}

export default defineConfig(({ mode }) => {
  const runtimeEnv = getFinalEnv(loadEnv(mode, dirname, 'VITE_'), mode)
  return {
    define: {
      __RUNTIME_ENV__: runtimeEnv
    },
    server: {
      host: 'localhost',
      port: 5173
    },
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      unimport.vite({
        presets: ['react'],
        dts: 'types/auto-imports.d.ts'
      })
    ],
    build: {
      rollupOptions: {
        maxParallelFileOps: 100
      }
    }
  }
})
