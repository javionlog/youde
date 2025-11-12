import { defineConfig } from 'drizzle-kit'

const { DATABASE_URL } = process.env

export default defineConfig({
  out: './src/db/migrations',
  schema: [
    './src/db/schemas/common/index.ts',
    './src/db/schemas/admin/index.ts',
    './src/db/schemas/portal/index.ts'
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  }
})
