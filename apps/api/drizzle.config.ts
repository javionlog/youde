import { defineConfig } from 'drizzle-kit'

const { DATABASE_URL } = process.env

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schemas/**.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  }
})
