import { boolean, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const adminUser = pgTable('admin_user', {
  ...commonFields,
  username: varchar('username', { length: 32 }).notNull().unique(),
  password: text('password').notNull(),
  banned: boolean().notNull(),
  isAdmin: boolean().notNull()
})

export const adminSession = pgTable('admin_session', {
  ...commonFields,
  expiresAt: text('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  username: text('username'),
  userId: text('user_id')
    .notNull()
    .references(() => adminUser.id, { onDelete: 'cascade' })
})
