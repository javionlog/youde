import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { thing } from '@/db/schemas/content'
import { dateJsonSpec, omitBodyFields, pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const statusSpec = {
  status: z.enum(['Draft', 'Pending', 'Passed'])
}

export const insertReqSchema = createInsertSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({
  ...omitBodyFields,
  id: true,
  userId: true,
  status: true
})

export const updateReqSchema = createInsertSchema(thing, { ...dateJsonSpec, id: z.string() }).omit({
  ...omitBodyFields,
  userId: true,
  status: true
})

export const deleteReqSchema = z.object({
  id: z.string()
})

export const searchReqSchema = z.object({
  ...pageSpec.shape,
  id: z.string().nullish(),
  categoryIds: z.array(z.string()).nullish(),
  title: z.string().nullish(),
  userId: z.string().nullish(),
  status: z.array(statusSpec.status).nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(thing))),
      direction: z.enum(['asc', 'desc'])
    })
    .optional()
    .default({ field: 'updatedAt', direction: 'desc' })
})

export const rowResSchema = createSelectSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({})

export const listResSchema = z.object({
  records: z.array(rowResSchema),
  total: z.number()
})

export const promiseRowResSchema = createSelectSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({})

export const promiseListResSchema = z.object({
  records: z.array(rowResSchema),
  total: z.number()
})
