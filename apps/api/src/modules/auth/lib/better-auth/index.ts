import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { openAPI, username } from 'better-auth/plugins'

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env
const sql = neon(DATABASE_URL)
const db = drizzle(sql)

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  basePath: '/auth',
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, { provider: 'pg' }),
  plugins: [openAPI(), username()]
})
