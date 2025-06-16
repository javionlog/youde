import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import solid from 'vite-plugin-solid'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173
  },
  plugins: [solid(), cloudflare()]
})
