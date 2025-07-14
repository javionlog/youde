import { OpenAPIHono } from '@hono/zod-openapi'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth'
import { openAPI, username } from 'better-auth/plugins'
import * as schema from '@/db/schemas/auth'

const {
  VITE_DATABASE_URL,
  VITE_BETTER_AUTH_URL,
  VITE_BETTER_AUTH_SECRET,
  VITE_BETTER_AUTH_TRUSTED_ORIGINS
} = import.meta.env

const app = new OpenAPIHono()
const sql = neon(VITE_DATABASE_URL)
const db = drizzle(sql, { schema })

export const auth = betterAuth({
  basePath: '/auth',
  baseURL: VITE_BETTER_AUTH_URL,
  secret: VITE_BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, { provider: 'pg' }),
  trustedOrigins() {
    return VITE_BETTER_AUTH_TRUSTED_ORIGINS.split(',')
  },
  plugins: [openAPI(), username()]
})

app.all('/auth/*', async c => {
  const response = await auth.handler(c.req.raw)
  if (response.status === 404) {
    return c.text('404 Not Found', 404)
  }
  return response
})

export default app
