import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import unimport from 'unimport/unplugin'

const curDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, curDir, 'VITE_')
  const { VITE_API_HOST_NAME, VITE_API_HOST_PORT } = env
  return {
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          target: `http://${VITE_API_HOST_NAME}:${VITE_API_HOST_PORT}`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
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
