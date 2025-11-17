import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminResourceLocale } from '@/db/schemas/admin'
import { omitReqFields } from '@/global/specs'

export const rowSepc = createSelectSchema(adminResourceLocale).omit({})
export type RowType = z.infer<typeof rowSepc>

export const rowResSpec = createSelectSchema(adminResourceLocale).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(z.array(rowResSpec))

export const createReqSpec = createInsertSchema(adminResourceLocale).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(adminResourceLocale, {
  id: z.string()
}).omit({
  ...omitReqFields,
  resourceId: true,
  field: true
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
