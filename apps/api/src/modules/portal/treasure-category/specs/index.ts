import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { treasureCategory, treasureCategoryLocale } from '@/db/schemas/common'
import { treeResSpec } from '@/modules/admin/treasure-category/specs'

export const rowSpec = createSelectSchema(treasureCategory).omit({})
export type RowType = z.infer<typeof rowSpec>

export const treasureCategoryLocaleResSpec = createSelectSchema(treasureCategoryLocale).omit({})

export const rowResSpec = z.object({
  ...createSelectSchema(treasureCategory).omit({}).shape,
  locales: z.array(treasureCategoryLocaleResSpec)
})

export const promiseRowResSpec = z.object({
  ...createSelectSchema(treasureCategory).omit({}).shape,
  locales: z.array(treasureCategoryLocaleResSpec)
})

export const promiseTreeResSpec = z.promise(z.array(treeResSpec))

export const listReqSpec = z.object({
  enabled: z.boolean().nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
