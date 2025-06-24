import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import unimport from 'unimport/unplugin'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173
  },
  plugins: [
    cloudflare(),
    tsconfigPaths(),
    tailwindcss(),
    unimport.vite({
      presets: ['react'],
      dts: 'auto-imports.d.ts'
    })
  ],
  build: {
    rollupOptions: {
      maxParallelFileOps: 100
    }
  }
})
