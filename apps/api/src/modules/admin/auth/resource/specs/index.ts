import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminResource, adminResourceLocale } from '@/db/schemas/admin'
import { omitReqFields } from '@/global/specs'

export const rowSepc = createSelectSchema(adminResource).omit({})
export type RowType = z.infer<typeof rowSepc>

export const resourceLocaleResSpec = createSelectSchema(adminResourceLocale).omit({})

export const rowResSpec = z.object({
  ...createSelectSchema(adminResource).omit({}).shape,
  locales: z.array(resourceLocaleResSpec)
})

/* @ts-ignore */
export const treeResSpec = z.object({
  ...rowResSpec.shape,
  /* @ts-ignore */
  get children() {
    return z.array(treeResSpec)
  }
})

/* @ts-ignore */
export const grantTreeResSpec = z.object({
  ...rowResSpec.shape,
  grant: z.boolean(),
  /* @ts-ignore */
  get children() {
    return z.array(grantTreeResSpec)
  }
})

export const promiseRowResSpec = z.object({
  ...createSelectSchema(adminResource).omit({}).shape,
  locales: z.array(resourceLocaleResSpec)
})

export const promiseTreeResSpec = z.promise(z.array(treeResSpec))

export const promiseGrantTreeResSpec = z.promise(z.array(grantTreeResSpec))

export const createReqSpec = createInsertSchema(adminResource).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(adminResource, {
  id: z.string()
}).omit({
  ...omitReqFields
})
export type UpdateReqType = z.infer<typeof updateReqSpec>

export const deleteReqSpec = rowResSpec.pick({ id: true })
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const getReqSpec = rowResSpec.pick({ id: true })
export type GetReqType = z.infer<typeof getReqSpec>

export const listReqSpec = z.object({
  enabled: z.boolean().nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>

export const listUserResourcesReqSpec = z.object({
  userId: z.string()
})
export type ListUserResourcesReqType = z.infer<typeof listUserResourcesReqSpec>

export const listRoleResourcesReqSpec = z.object({
  roleId: z.string()
})
export type ListRoleResourcesReqType = z.infer<typeof listRoleResourcesReqSpec>

export const listRoleGrantResourcesReqSpec = z.object({
  roleId: z.string()
})
export type ListRoleGrantResourcesReqType = z.infer<typeof listRoleGrantResourcesReqSpec>
