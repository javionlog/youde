import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { treasure } from '@/db/schemas/common'
import { omitReqFields, pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const rowSpec = createSelectSchema(treasure).omit({})
export type RowType = z.infer<typeof rowSpec>

export const rowResSpec = createSelectSchema(treasure).omit({})

export const listResSpec = z.object({
  records: z.array(rowResSpec),
  total: z.number()
})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(listResSpec)

export const createReqSpec = createInsertSchema(treasure).omit({
  ...omitReqFields,
  id: true,
  userId: true,
  status: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(treasure, {
  id: z.string()
}).omit({
  ...omitReqFields,
  userId: true,
  status: true
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
  ...pageSpec.shape,
  id: z.string().nullish(),
  title: z.string().nullish(),
  createdBy: z.string().nullish(),
  fees: z.array(rowResSpec.shape.fee).nullish(),
  categoryIds: z.array(z.string()).nullish(),
  status: z.array(rowSpec.shape.status).nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(treasure))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
