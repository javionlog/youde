import type { AuthContext } from 'better-auth'
import { toZodSchema } from 'better-auth/db'
import type { z } from 'zod'
import { throwDataNotFoundError } from '../error-handle'
import { roleResourceRelationSchema } from '../schemas/role-resource-relation'

const roleResourceRelationSpec = toZodSchema({
  fields: roleResourceRelationSchema.roleResourceRelation.fields,
  isClientSide: false
})
type RoleResourceRelationSpec = z.infer<typeof roleResourceRelationSpec>

export const getOneRoleResource = async (ctx: AuthContext, params: RoleResourceRelationSpec) => {
  const { adapter } = ctx
  const { roleId, resourceId } = params
  const row = await adapter.findOne<RoleResourceRelationSpec>({
    model: 'roleResourceRelation',
    where: [
      { field: 'roleId', value: roleId },
      { field: 'resourceId', value: resourceId }
    ]
  })
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}
