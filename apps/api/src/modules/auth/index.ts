import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { openAPI, username } from 'better-auth/plugins'
import * as schema from '@/db/schemas/auth'

export const auth = (env: CloudflareBindings) => {
  const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET, BETTER_AUTH_TRUSTED_ORIGINS } = env
  const sql = neon(DATABASE_URL)
  const db = drizzle(sql, { schema })

  return betterAuth({
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
}
