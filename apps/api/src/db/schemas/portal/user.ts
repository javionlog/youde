import { boolean, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const portalUser = pgTable('portal_user', {
  ...commonFields,
  username: varchar('username', { length: 32 }).notNull().unique(),
  email: varchar('email', { length: 128 }).notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  phone: varchar('phone', { length: 32 }),
  avatar: varchar('avatar', { length: 256 })
})

export const portalSession = pgTable('portal_session', {
  ...commonFields,
  expiresAt: text('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => portalUser.id, { onDelete: 'cascade' })
})

export const portalAccount = pgTable('portal_account', {
  ...commonFields,
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => portalUser.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: text('access_token_expires_at'),
  refreshTokenExpiresAt: text('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password')
})

export const portalVerification = pgTable('portal_verification', {
  ...commonFields,
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: text('expires_at').notNull()
})
