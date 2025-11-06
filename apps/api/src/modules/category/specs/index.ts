import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { category, categoryLocale } from '@/db/schemas/thing'
import { omitReqFields } from '@/global/specs'

export const insertReqSpec = createInsertSchema(category).omit({
  ...omitReqFields,
  id: true
})

export const updateReqSpec = createInsertSchema(category).omit({
  ...omitReqFields
})

export const deleteReqSpec = z.object({
  id: z.string()
})

export const getReqSpec = z.object({
  id: z.string()
})

export const searchReqSpec = z.object({
  enabled: z.boolean().nullish()
})

export const categoryLocaleResSpec = createSelectSchema(categoryLocale).omit({})

export const rowResSpec = z.object({
  ...createSelectSchema(category).omit({}).shape,
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
  ...createSelectSchema(category).omit({}).shape,
  locales: z.array(categoryLocaleResSpec)
})

export const promiseTreeResSpec = z.promise(z.array(treeResSpec))
