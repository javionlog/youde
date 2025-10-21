import { integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { commonFields } from './common'

export const category = pgTable('category', {
  ...commonFields,
  name: text('name').notNull()
})

export const categoryLocale = pgTable(
  'category_locale',
  {
    ...commonFields,
    categoryId: text('category_id').notNull(),
    field: text('field').notNull(),
    enUs: text('en_us').notNull(),
    zhCn: text('zh_cn').notNull()
  },
  table => [uniqueIndex('categoryIdFieldUniqueIndex').on(table.categoryId, table.field)]
)

export const thing = pgTable('thing', {
  ...commonFields,
  categoryId: text('category_id').notNull(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  cover: text('cover'),
  content: text('content'),
  status: text('status').notNull()
})

export const thingRate = pgTable(
  'thing_rate',
  {
    ...commonFields,
    thingId: text('thing_id').notNull(),
    userId: text('user_id').notNull(),
    score: integer('score').notNull()
  },
  table => [uniqueIndex('thingIdUserIdUniqueIndex').on(table.thingId, table.userId)]
)

export const thingComment = pgTable('thing_comment', {
  ...commonFields,
  thingId: text('thing_id').notNull(),
  userId: text('user_id').notNull(),
  parentId: text('parent_id'),
  content: integer('content').notNull(),
  status: text('status').notNull()
})

export const tag = pgTable('tag', {
  ...commonFields,
  name: text('name').notNull()
})

export const thingTagRelation = pgTable(
  'thing_tag_relation',
  {
    ...commonFields,
    thingId: text('thing_id').notNull(),
    tagId: text('tag_id').notNull()
  },
  table => [uniqueIndex('thingIdTagIdUniqueIndex').on(table.thingId, table.tagId)]
)
