import type { AuthContext } from 'better-auth'
import { z } from 'zod'
import { throwDataNotFoundError } from '../errors'
import { userRoleRelationSchema } from '../schemas/user-role-relation'
import { pageSpec } from '../specs'
import { getZodSchema } from '../utils'

export const userRoleRelationSpec = getZodSchema({
  fields: userRoleRelationSchema.userRoleRelation.fields,
  isClientSide: false
})

export const userRoleRelationListSpec = z.object({
  ...pageSpec.shape,
  ...userRoleRelationSpec.partial().shape
})

export type UserRoleRelationSpec = z.infer<typeof userRoleRelationSpec>

export const getOneUserRole = async (ctx: AuthContext, params: UserRoleRelationSpec) => {
  const { adapter } = ctx
  const { userId, roleId } = params
  const row = await adapter.findOne<UserRoleRelationSpec>({
    model: 'userRoleRelation',
    where: [
      { field: 'userId', value: userId },
      { field: 'roleId', value: roleId }
    ]
  })
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}
