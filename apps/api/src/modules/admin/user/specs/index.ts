import { getTableColumns } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { adminUser } from '@/db/schemas/admin'
import { omitReqFields, pageSpec } from '@/global/specs'
import { getKeys, passwordRegex, usernameRegex } from '@/global/utils'
import { treeResSpec } from '@/modules/admin/auth/resource/specs'

const usernameErrorMessage = '4 to 16 digits, letters, numbers, underscores, minus signs'

const passwordErrorMessage =
  '8 to 64 digits, must contain capital letters, lowercase letters, numbers, @#$%^&*`~()-+='

export const rowSepc = createSelectSchema(adminUser).omit({})
export type RowType = z.infer<typeof rowSepc>

export const rowResSpec = createSelectSchema(adminUser).omit({ password: true })

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(
  z.object({
    records: z.array(rowResSpec),
    total: z.number()
  })
)

export const signInResSpec = z.object({
  token: z.string(),
  user: rowResSpec.pick({ id: true, username: true, isAdmin: true }),
  resourceTree: z.array(treeResSpec)
})

export const promiseSignInResSpec = z.promise(signInResSpec)

export const signInReqSpec = createInsertSchema(adminUser, {
  username: z.string().trim().min(1),
  password: z.string().trim().min(1)
}).omit({
  ...omitReqFields,
  id: true,
  enabled: true,
  isAdmin: true
})
export type SignInReqType = z.infer<typeof signInReqSpec>

export const signOutReqSpec = z.object({
  token: z.string()
})
export type SignOutReqType = z.infer<typeof signOutReqSpec>

export const createReqSpec = createInsertSchema(adminUser, {
  username: z.string().regex(usernameRegex, { error: usernameErrorMessage }),
  password: z.string().regex(passwordRegex, { error: passwordErrorMessage })
}).omit({
  ...omitReqFields,
  id: true
})
export type CreateReqType = z.infer<typeof createReqSpec>

export const updateReqSpec = createInsertSchema(adminUser, { id: z.string() }).omit({
  ...omitReqFields,
  password: true
})
export type UpdateReqType = z.infer<typeof updateReqSpec>

export const resetPasswordReqSpec = z.object({
  id: z.string(),
  password: z.string().regex(passwordRegex, { error: passwordErrorMessage })
})
export type ResetPasswordReqType = z.infer<typeof resetPasswordReqSpec>

export const resetSelfPasswordReqSpec = z.object({
  id: z.string(),
  oldPassword: z.string(),
  newPassword: z.string().regex(passwordRegex, { error: passwordErrorMessage })
})
export type ResetSelfPasswordReqType = z.infer<typeof resetSelfPasswordReqSpec>

export const deleteReqSpec = rowResSpec.pick({ id: true })
export type DeleteReqType = z.infer<typeof deleteReqSpec>

export const getReqSpec = rowResSpec.pick({ id: true })
export type GetReqType = z.infer<typeof getReqSpec>

export const listReqSpec = z.object({
  ...pageSpec.shape,
  username: z.string().nullish(),
  enabled: z.boolean().nullish(),
  isAdmin: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminUser))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>

export const listRoleUsersReqSpec = z.object({
  ...pageSpec.shape,
  roleId: z.string(),
  username: z.string().nullish(),
  enabled: z.boolean().nullish(),
  isAdmin: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminUser))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListRoleUsersReqType = z.infer<typeof listRoleUsersReqSpec>

export const listResourceUsersReqSpec = z.object({
  ...pageSpec.shape,
  resourceId: z.string(),
  username: z.string().nullish(),
  enabled: z.boolean().nullish(),
  isAdmin: z.boolean().nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(adminUser))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListResourceUsersReqType = z.infer<typeof listResourceUsersReqSpec>
