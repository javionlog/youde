import { neon } from '@neondatabase/serverless'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI, username } from 'better-auth/plugins'
import { drizzle } from 'drizzle-orm/neon-http'
import { Elysia } from 'elysia'
import * as schema from '@/db/schemas/auth'

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET, BETTER_AUTH_TRUSTED_ORIGINS } =
  process.env

const app = new Elysia()
const sql = neon(DATABASE_URL)
const db = drizzle(sql, { schema })

export const authInstance = betterAuth({
  basePath: '/auth',
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, { provider: 'pg' }),
  trustedOrigins() {
    return BETTER_AUTH_TRUSTED_ORIGINS.split(',')
  },
  plugins: [openAPI(), username()]
})

app.mount(authInstance.handler)

export default app
