import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminSession } from '@/db/schemas/admin'
import { omitReqFields, pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const rowSepc = createSelectSchema(adminSession).omit({})
export type RowType = z.infer<typeof rowSepc>

export const rowResSpec = createSelectSchema(adminSession).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(
  z.object({
    records: z.array(rowResSpec),
    total: z.number()
  })
)

export const createReqSpec = createInsertSchema(adminSession, {}).omit({
  ...omitReqFields,
  id: true,
  token: true,
  expiresAt: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const deleteReqSpec = rowResSpec.pick({ token: true })
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const getReqSpec = rowResSpec.pick({ token: true })
export type GetReqType = z.infer<typeof getReqSpec>

export const listReqSpec = z.object({
  ...pageSpec.shape,
  username: z.string().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminSession))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
