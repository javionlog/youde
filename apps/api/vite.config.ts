import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import devServer from '@hono/vite-dev-server'
import build from '@hono/vite-build/node'

const curDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, curDir)
  const { VITE_SERVER_HOST_NAME, VITE_SERVER_HOST_PORT } = env
  return {
    server: {
      host: VITE_SERVER_HOST_NAME,
      port: Number(VITE_SERVER_HOST_PORT)
    },
    build: {
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'vendor',
                test: /node_modules/
              }
            ]
          }
        }
      }
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
