import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { categoryLocale } from '@/db/schemas/common'
import { omitReqFields } from '@/global/specs'

export const rowSpec = createSelectSchema(categoryLocale).omit({})
export type RowType = z.infer<typeof rowSpec>

export const rowResSpec = createSelectSchema(categoryLocale).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const createReqSpec = createInsertSchema(categoryLocale).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(categoryLocale, { id: z.string() }).pick({
  id: true,
  enUs: true,
  zhCn: true
})
export type UpdateReqType = z.infer<typeof updateReqSpec>

export const deleteReqSpec = z.object({
  id: z.string()
})
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const getReqSpec = z.object({
  id: z.string()
})
export type GetReqType = z.infer<typeof getReqSpec>
