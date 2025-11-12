import { integer, pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const thing = pgTable('thing', {
  ...commonFields,
  categoryId: text('category_id').notNull(),
  userId: text('user_id').notNull(),
  title: varchar('title', { length: 256 }).notNull().unique(),
  description: varchar('description', { length: 1024 }).notNull(),
  fee: text('fee', { enum: ['Free', 'Partly Free', 'Paid'] }).notNull(),
  country: varchar('country', { length: 2 }).notNull(),
  cover: varchar('cover', { length: 256 }),
  content: text('content').notNull(),
  url: varchar('url', { length: 256 }).notNull(),
  status: text('status', { enum: ['Draft', 'Pending', 'Passed'] }).notNull()
})

export const thingMeta = pgTable(
  'thing_meta',
  {
    ...commonFields,
    thingId: text('thing_id').notNull(),
    userId: text('user_id').notNull(),
    tagId: text('tag_id').notNull(),
    platform: text('platform', {
      enum: ['Web', 'Windows', 'Linux', 'macOS', 'Android', 'iOS', 'Harmony OS']
    }).notNull()
  },
  table => [
    uniqueIndex('thingIdPlatformUniqueIndex').on(table.thingId, table.platform),
    uniqueIndex('thingIdTagIdUniqueIndex').on(table.thingId, table.tagId)
  ]
)

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
  content: text('content').notNull(),
  status: text('status', { enum: ['Pending', 'Passed'] }).notNull()
})

export const tag = pgTable('tag', {
  ...commonFields,
  name: varchar('name', { length: 64 }).notNull(),
  status: text('status', { enum: ['Pending', 'Passed'] }).notNull()
})
