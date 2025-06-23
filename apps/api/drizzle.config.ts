import { defineConfig } from 'drizzle-kit'
import { env } from 'cloudflare:workers'

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schemas/**.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  }
})
