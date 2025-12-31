import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { treasureCategory, treasureCategoryLocale } from '@/db/schemas/common'
import { omitReqFields } from '@/global/specs'

export const rowSpec = createSelectSchema(treasureCategory).omit({})
export type RowType = z.infer<typeof rowSpec>

export const treasureCategoryLocaleResSpec = createSelectSchema(treasureCategoryLocale).omit({})

export const rowResSpec = z.object({
  ...createSelectSchema(treasureCategory).omit({}).shape,
  locales: z.array(treasureCategoryLocaleResSpec)
})

/* @ts-ignore */
export const treeResSpec = z.object({
  ...rowResSpec.shape,
  /* @ts-ignore */
  get children() {
    return z.array(treeResSpec)
  }
})

export const promiseRowResSpec = z.object({
  ...createSelectSchema(treasureCategory).omit({}).shape,
  locales: z.array(treasureCategoryLocaleResSpec)
})

export const promiseTreeResSpec = z.promise(z.array(treeResSpec))

export const createReqSpec = createInsertSchema(treasureCategory).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(treasureCategory, {
  id: z.string()
}).omit({
  ...omitReqFields
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

export const listReqSpec = z.object({
  enabled: z.boolean().nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
