import { boolean, integer, pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const category = pgTable('category', {
  ...commonFields,
  parentId: text('parent_id'),
  name: varchar('name', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').notNull(),
  sort: integer('sort').notNull()
})

export const categoryLocale = pgTable(
  'category_locale',
  {
    ...commonFields,
    categoryId: text('category_id').notNull(),
    field: text('field', { enum: ['name'] }).notNull(),
    enUs: varchar('en_us', { length: 64 }).notNull(),
    zhCn: varchar('zh_cn', { length: 64 }).notNull()
  },
  table => [uniqueIndex('categoryIdFieldUniqueIndex').on(table.categoryId, table.field)]
)
