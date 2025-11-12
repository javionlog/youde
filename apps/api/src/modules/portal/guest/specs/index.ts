import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { thing } from '@/db/schemas/common'
import { omitReqFields, pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const statusSpec = {
  status: z.enum(['Draft', 'Pending', 'Passed'])
}

export const createReqSpec = createInsertSchema(thing, {
  ...statusSpec
}).omit({
  ...omitReqFields,
  id: true,
  userId: true,
  status: true
})

export const updateReqSpec = createInsertSchema(thing).omit({
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

export const listReqSpec = z.object({
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
    .partial()
    .nullish()
})

export const rowResSpec = createSelectSchema(thing, {
  ...statusSpec
}).omit({})

export const listResSpec = z.object({
  records: z.array(rowResSpec),
  total: z.number()
})

export const promiseRowResSpec = createSelectSchema(thing, {
  ...statusSpec
}).omit({})

export const promiseListResSpec = z.promise(
  z.object({
    records: z.array(rowResSpec),
    total: z.number()
  })
)
