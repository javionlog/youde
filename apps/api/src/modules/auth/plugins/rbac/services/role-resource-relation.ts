import type { AuthContext } from 'better-auth'
import { z } from 'zod'
import { getZodSchema } from '@/global/utils'
import { throwDataNotFoundError } from '../errors'
import { roleResourceRelationSchema } from '../schemas/role-resource-relation'
import { pageSpec } from '../specs'

export const roleResourceRelationSpec = getZodSchema({
  fields: roleResourceRelationSchema.roleResourceRelation.fields,
  isClientSide: false
})

export const roleResourceRelationListSpec = z.object({
  ...pageSpec.shape,
  ...roleResourceRelationSpec.partial().shape
})

export type RoleResourceRelationSpec = z.infer<typeof roleResourceRelationSpec>

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
