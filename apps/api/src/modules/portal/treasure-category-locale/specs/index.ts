import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { treasureCategoryLocale } from '@/db/schemas/common'

export const rowSpec = createSelectSchema(treasureCategoryLocale).omit({})
export type RowType = z.infer<typeof rowSpec>

export const rowResSpec = createSelectSchema(treasureCategoryLocale).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const getReqSpec = z.object({
  id: z.string()
})
export type GetReqType = z.infer<typeof getReqSpec>
