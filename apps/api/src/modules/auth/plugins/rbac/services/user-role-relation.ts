import type { AuthContext } from 'better-auth'
import type { z } from 'zod'
import { throwDataNotFoundError } from '../errors'
import { userRoleRelationSchema } from '../schemas/user-role-relation'
import { getZodSchema } from '../utils'

const userRoleRelationSpec = getZodSchema({
  fields: userRoleRelationSchema.userRoleRelation.fields,
  isClientSide: false
})
type UserRoleRelationSpec = z.infer<typeof userRoleRelationSpec>

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
