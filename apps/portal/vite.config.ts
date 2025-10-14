import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: 'localhost',
    port: 5174
    // proxy: {
    //   '/api': {
    //     target: `http://${VITE_API_HOST_NAME}:${Number(VITE_API_HOST_PORT)}`,
    //     changeOrigin: true,
    //     rewrite: path => {
    //       return path.replace(/^\/api/, '')
    //     }
    //   }
    // }
  }
})
