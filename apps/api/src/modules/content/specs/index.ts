import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { thing } from '@/db/schemas/content'
import { dateJsonSpec, omitReqFields, pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const statusSpec = {
  status: z.enum(['Draft', 'Pending', 'Passed'])
}

export const insertReqSpec = createInsertSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({
  ...omitReqFields,
  id: true,
  userId: true,
  status: true
})

export const updateReqSpec = createInsertSchema(thing, { ...dateJsonSpec, id: z.string() }).omit({
  ...omitReqFields,
  userId: true,
  status: true
})

export const deleteReqSpec = z.object({
  id: z.string()
})

export const getReqSpec = z.object({
  id: z.string()
})

export const searchReqSpec = z.object({
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

export const rowResSpec = createSelectSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({})

export const listResSpec = z.object({
  records: z.array(rowResSpec),
  total: z.number()
})

export const promiseRowResSpec = createSelectSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({})

export const promiseListResSpec = z.object({
  records: z.array(rowResSpec),
  total: z.number()
})
