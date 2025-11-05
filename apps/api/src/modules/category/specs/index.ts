import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { category, categoryLocale } from '@/db/schemas/thing'
import { dateJsonSpec, omitReqFields } from '@/global/specs'

export const insertReqSpec = createInsertSchema(category, {
  ...dateJsonSpec
}).omit({
  ...omitReqFields,
  id: true
})

export const updateReqSpec = createInsertSchema(category, { ...dateJsonSpec, id: z.string() }).omit(
  {
    ...omitReqFields
  }
)

export const deleteReqSpec = z.object({
  id: z.string()
})

export const getReqSpec = z.object({
  id: z.string()
})

export const searchReqSpec = z.object({
  enabled: z.boolean().nullish()
})

export const categoryLocaleResSpec = createSelectSchema(categoryLocale, { ...dateJsonSpec }).omit(
  {}
)

export const rowResSpec = z.object({
  ...createSelectSchema(category, {
    ...dateJsonSpec
  }).omit({}).shape,
  locales: z.array(categoryLocaleResSpec)
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
  ...createSelectSchema(category, {
    ...dateJsonSpec
  }).omit({}).shape,
  locales: z.array(categoryLocaleResSpec)
})

export const promiseTreetResSpec = z.promise(z.array(treeResSpec))
