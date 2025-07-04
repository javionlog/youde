import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import devServer from '@hono/vite-dev-server'
import build from '@hono/vite-build/node'

const curDir = fileURLToPath(new URL('.', import.meta.url))

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
  const runtimeEnv = getFinalEnv(loadEnv(mode, curDir, ['BETTER_AUTH', 'DATABASE_']), mode)
  return {
    define: {
      __RUNTIME_ENV__: runtimeEnv
    },
    server: {
      host: 'localhost',
      port: 8787
    },
    plugins: [
      tsconfigPaths(),
      devServer({
        entry: './src/main.ts'
      }),
      build({
        entry: './src/main.ts'
      })
    ]
  }
})
