import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 8787
  },
  plugins: [cloudflare(), tsconfigPaths()]
})
