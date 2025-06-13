import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid(), cloudflare()]
})
