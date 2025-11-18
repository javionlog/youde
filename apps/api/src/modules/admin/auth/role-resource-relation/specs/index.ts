import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminRoleResourceRelation } from '@/db/schemas/admin'
import { omitReqFields, pageSpec } from '@/global/specs'

export const rowSpec = createSelectSchema(adminRoleResourceRelation).omit({})
export type RowType = z.infer<typeof rowSpec>

export const rowResSpec = createSelectSchema(adminRoleResourceRelation).omit({})

export const listResSpec = z.object({
  records: z.array(rowResSpec),
  total: z.number()
})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(listResSpec)

export const createReqSpec = createInsertSchema(adminRoleResourceRelation).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const setManyReqSpec = z.object({
  roleId: z.string(),
  createResourceIds: z.array(z.string()),
  deleteResourceIds: z.array(z.string())
})
export type SetManyReqType = z.infer<typeof setManyReqSpec>

export const deleteReqSpec = rowResSpec.pick({ roleId: true, resourceId: true })
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const listReqSpec = z.object({
  ...pageSpec.shape,
  ...rowResSpec.pick({ roleId: true, resourceId: true }).partial().shape,
  roleIds: z.array(z.string()).nullish(),
  resourceIds: z.array(z.string()).nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
