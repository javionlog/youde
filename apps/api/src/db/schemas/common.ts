import { text, timestamp } from 'drizzle-orm/pg-core'

export const commonFields = {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  createdBy: text('created_by'),
  updatedBy: text('updated_by')
}
