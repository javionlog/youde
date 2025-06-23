import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { openAPI, username } from 'better-auth/plugins'
import * as schema from '../../db/schemas/auth'
import { env } from 'cloudflare:workers'

const getEnv = () => {
  const DATABASE_URL = process.env.DATABASE_URL ?? env.DATABASE_URL
  const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? env.BETTER_AUTH_URL
  const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? env.BETTER_AUTH_SECRET
  const BETTER_AUTH_TRUSTED_ORIGINS =
    process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? env.BETTER_AUTH_TRUSTED_ORIGINS
  return {
    DATABASE_URL,
    BETTER_AUTH_URL,
    BETTER_AUTH_SECRET,
    BETTER_AUTH_TRUSTED_ORIGINS
  }
}

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET, BETTER_AUTH_TRUSTED_ORIGINS } = getEnv()
const sql = neon(DATABASE_URL)
const db = drizzle(sql, { schema })

export const auth: ReturnType<typeof betterAuth> = betterAuth({
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
