import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173
  },
  plugins: [cloudflare(), tsconfigPaths(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'tdesign-react': ['tdesign-react']
        }
      }
    }
  }
})
