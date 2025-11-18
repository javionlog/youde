import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminResourceLocale } from '@/db/schemas/admin'
import { omitReqFields } from '@/global/specs'

export const rowSpec = createSelectSchema(adminResourceLocale).omit({})
export type RowType = z.infer<typeof rowSpec>

export const rowResSpec = createSelectSchema(adminResourceLocale).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const createReqSpec = createInsertSchema(adminResourceLocale).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(adminResourceLocale, {
  id: z.string()
}).pick({
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
