import { betterAuth } from 'better-auth'
import { openAPI, username } from 'better-auth/plugins'
import { db } from '@/db'
import { rbac } from '../plugins/rbac'
import { drizzleAdapter } from './drizzle-adapter'

const { BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env

export const auth = betterAuth({
  basePath: '/auth',
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, { provider: 'pg' }),
  trustedOrigins() {
    return ['*']
  },
  plugins: [openAPI(), username(), rbac()]
})
