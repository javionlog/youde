import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminUserRoleRelation } from '@/db/schemas/admin'
import { omitReqFields, pageSpec } from '@/global/specs'

export const rowSepc = createSelectSchema(adminUserRoleRelation).omit({})
export type RowType = z.infer<typeof rowSepc>

export const rowResSpec = createSelectSchema(adminUserRoleRelation).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(
  z.object({
    records: z.array(rowResSpec),
    total: z.number()
  })
)

export const createReqSpec = createInsertSchema(adminUserRoleRelation).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const deleteReqSpec = rowResSpec.pick({ userId: true, roleId: true })
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const listReqSpec = z.object({
  ...pageSpec.shape,
  ...rowResSpec.pick({ userId: true, roleId: true }).partial().shape,
  userIds: z.array(z.string()).nullish(),
  roleIds: z.array(z.string()).nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
