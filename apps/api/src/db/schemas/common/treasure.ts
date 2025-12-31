import { boolean, integer, pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const treasure = pgTable('treasure', {
  ...commonFields,
  categoryId: text('category_id').notNull(),
  userId: text('user_id').notNull(),
  title: varchar('title', { length: 256 }).notNull().unique(),
  description: varchar('description', { length: 1024 }).notNull(),
  fee: text('fee', { enum: ['Free', 'PartlyFree', 'Paid'] }).notNull(),
  countryCode: varchar('country_code', { length: 16 }).notNull(),
  cover: varchar('cover', { length: 256 }),
  content: text('content').notNull(),
  url: varchar('url', { length: 256 }).notNull(),
  status: text('status', { enum: ['Draft', 'Pending', 'Passed'] }).notNull()
})

export const treasureMeta = pgTable(
  'treasure_meta',
  {
    ...commonFields,
    treasureId: text('treasure_id').notNull(),
    userId: text('user_id').notNull(),
    tagId: text('tag_id').notNull(),
    platform: text('platform', {
      enum: ['Web', 'Windows', 'Linux', 'macOS', 'Android', 'iOS', 'HarmonyOS']
    }).notNull()
  },
  table => [
    uniqueIndex('treasureIdPlatformUniqueIndex').on(table.treasureId, table.platform),
    uniqueIndex('treasureIdTagIdUniqueIndex').on(table.treasureId, table.tagId)
  ]
)

export const treasureRate = pgTable(
  'treasure_rate',
  {
    ...commonFields,
    treasureId: text('treasure_id').notNull(),
    userId: text('user_id').notNull(),
    score: integer('score').notNull()
  },
  table => [uniqueIndex('treasureIdUserIdUniqueIndex').on(table.treasureId, table.userId)]
)

export const treasureComment = pgTable('treasure_comment', {
  ...commonFields,
  treasureId: text('treasure_id').notNull(),
  userId: text('user_id').notNull(),
  parentId: text('parent_id'),
  content: text('content').notNull(),
  status: text('status', { enum: ['Pending', 'Passed'] }).notNull()
})

export const treasureTag = pgTable('treasure_tag', {
  ...commonFields,
  name: varchar('name', { length: 64 }).notNull(),
  status: text('status', { enum: ['Pending', 'Passed'] }).notNull()
})

export const treasureCategory = pgTable('treasure_category', {
  ...commonFields,
  parentId: text('parent_id'),
  name: varchar('name', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').notNull(),
  sort: integer('sort').notNull()
})

export const treasureCategoryLocale = pgTable(
  'treasure_category_locale',
  {
    ...commonFields,
    categoryId: text('category_id').notNull(),
    field: text('field', { enum: ['name'] }).notNull(),
    enUs: varchar('en_us', { length: 64 }).notNull(),
    zhCn: varchar('zh_cn', { length: 64 }).notNull()
  },
  table => [uniqueIndex('categoryIdFieldUniqueIndex').on(table.categoryId, table.field)]
)
