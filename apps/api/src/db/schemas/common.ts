import { text } from 'drizzle-orm/pg-core'

export const commonFields = {
  id: text('id').primaryKey(),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
  createdBy: text('created_by'),
  updatedBy: text('updated_by')
}
