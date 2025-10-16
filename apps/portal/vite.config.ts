import { fileURLToPath } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const curDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, curDir, 'VITE_')
  const { VITE_API_HOST_NAME, VITE_API_HOST_PORT } = env
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      host: 'localhost',
      port: 9000,
      proxy: {
        '/api': {
          target: `http://${VITE_API_HOST_NAME}:${Number(VITE_API_HOST_PORT)}`,
          changeOrigin: true,
          rewrite: path => {
            return path.replace(/^\/api/, '')
          }
        }
      }
    },
    ssr: {
      noExternal: true
    },
    build: {
      rollupOptions: isSsrBuild
        ? {
            input: './server/app.ts'
          }
        : undefined
    }
  }
})
