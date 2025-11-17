import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminRole } from '@/db/schemas/admin'
import { omitReqFields, pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const rowSepc = createSelectSchema(adminRole).omit({})
export type RowType = z.infer<typeof rowSepc>

export const rowResSpec = createSelectSchema(adminRole).omit({})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(
  z.object({
    records: z.array(rowResSpec),
    total: z.number()
  })
)

export const promiseListUserGrantRolesResSpec = z.promise(
  z.object({
    records: z.array(z.object({ ...rowResSpec.shape, grant: z.boolean() })),
    total: z.number()
  })
)

export const createReqSpec = createInsertSchema(adminRole).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(adminRole, { id: z.string() }).omit({
  ...omitReqFields
})
export type UpdateReqType = z.infer<typeof updateReqSpec>

export const deleteReqSpec = rowResSpec.pick({ id: true })
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const getReqSpec = rowResSpec.pick({ id: true })
export type GetReqType = z.infer<typeof getReqSpec>

export const listReqSpec = z.object({
  ...pageSpec.shape,
  name: z.string().nullish(),
  enabled: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminRole))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>

export const listUserRolesReqSpec = z.object({
  ...pageSpec.shape,
  userId: z.string(),
  name: z.string().nullish(),
  enabled: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminRole))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListUserRolesReqType = z.infer<typeof listUserRolesReqSpec>

export const listUserGrantRolesReqSpec = z.object({
  ...pageSpec.shape,
  userId: z.string(),
  name: z.string().nullish(),
  enabled: z.boolean().nullish(),
  grant: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminRole))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListUserGrantRolesReqType = z.infer<typeof listUserGrantRolesReqSpec>

export const listResourceRolesReqSpec = z.object({
  ...pageSpec.shape,
  resourceId: z.string(),
  name: z.string().nullish(),
  enabled: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminRole))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListResourceRolesReqType = z.infer<typeof listResourceRolesReqSpec>
