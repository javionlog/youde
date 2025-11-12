import { boolean, integer, pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const adminRole = pgTable('admin_role', {
  ...commonFields,
  name: varchar('name', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').notNull(),
  remark: varchar('remark', { length: 128 })
})

export const adminResource = pgTable('admin_resource', {
  ...commonFields,
  name: varchar('name', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').notNull(),
  remark: varchar('remark', { length: 128 }),
  sort: integer('sort').notNull(),
  parentId: text('parent_id'),
  type: text('type', { enum: ['Menu', 'Page', 'Element'] }).notNull(),
  path: varchar('path', { length: 256 }).unique(),
  activePath: varchar('active_path', { length: 256 }),
  component: varchar('component', { length: 256 }),
  icon: varchar('icon', { length: 256 }),
  isLink: boolean('is_link').notNull(),
  isCache: boolean('is_cache').notNull(),
  isAffix: boolean('is_affix').notNull(),
  isShow: boolean('is_show').notNull()
})

export const adminUserRoleRelation = pgTable(
  'admin_user_role_relation',
  {
    ...commonFields,
    userId: text('user_id').notNull(),
    roleId: text('role_id').notNull()
  },
  table => [uniqueIndex('userIdRoleIdUniqueIndex').on(table.userId, table.roleId)]
)

export const adminRoleResourceRelation = pgTable(
  'admin_role_resource_relation',
  {
    ...commonFields,
    roleId: text('role_id').notNull(),
    resourceId: text('resource_id').notNull()
  },
  table => [uniqueIndex('roleIdResourceIdUniqueIndex').on(table.roleId, table.resourceId)]
)

export const adminResourceLocale = pgTable(
  'admin_resource_locale',
  {
    ...commonFields,
    resourceId: text('resource_id').notNull(),
    field: text('field', { enum: ['name'] }).notNull(),
    enUs: varchar('en_us', { length: 64 }).notNull(),
    zhCn: varchar('zh_cn', { length: 64 }).notNull()
  },
  table => [uniqueIndex('resourceIdFieldUniqueIndex').on(table.resourceId, table.field)]
)
