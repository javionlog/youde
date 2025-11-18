import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { commonFields } from '@/db/utils'

export const country = pgTable('country', {
  ...commonFields,
  code: varchar('code', { length: 16 }).notNull().unique(),
  region: varchar('region', { length: 64 }).notNull(),
  enUs: varchar('en_us', { length: 128 }).notNull().unique(),
  zhCn: varchar('zh_cn', { length: 128 }).notNull().unique()
})
