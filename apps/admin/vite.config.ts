import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173
  },
  plugins: [tsconfigPaths(), cloudflare()]
})
