import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text('username').unique(),
  displayUsername: text('display_username')
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' })
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
})

export const role = pgTable('role', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  name: text('name').notNull().unique(),
  enabled: boolean('enabled'),
  remark: text('remark')
})

export const resource = pgTable('resource', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  name: text('name').notNull().unique(),
  enabled: boolean('enabled'),
  remark: text('remark'),
  sort: integer('sort'),
  parentId: text('parent_id'),
  type: text('type').notNull(),
  path: text('path'),
  activePath: text('active_path'),
  component: text('component'),
  icon: text('icon'),
  isLink: boolean('is_link'),
  isCache: boolean('is_cache'),
  isAffix: boolean('is_affix'),
  isShow: boolean('is_show')
})

export const userRoleRelation = pgTable('user_role_relation', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  roleId: text('role_id').notNull()
})

export const roleResourceRelation = pgTable('role_resource_relation', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull(),
  resourceId: text('resource_id').notNull()
})

export const resourceLocale = pgTable('resource_locale', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  resourceId: text('resource_id').notNull(),
  field: text('field').notNull(),
  enUs: text('en_us').notNull(),
  zhCn: text('zh_cn').notNull()
})
