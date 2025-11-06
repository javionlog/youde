import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { categoryLocale } from '@/db/schemas/thing'
import { omitReqFields } from '@/global/specs'

export const insertReqSpec = createInsertSchema(categoryLocale).omit({
  ...omitReqFields,
  id: true
})

export const updateReqSpec = createInsertSchema(categoryLocale).omit({
  ...omitReqFields,
  id: true
})

export const deleteReqSpec = z.object({
  id: z.string()
})

export const getReqSpec = z.object({
  categoryId: z.string(),
  field: z.string()
})

export const rowResSpec = createSelectSchema(categoryLocale).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(z.array(rowResSpec))
