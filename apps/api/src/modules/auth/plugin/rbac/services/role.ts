import type { AuthContext } from 'better-auth'
import { APIError } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { z } from 'zod'
import { roleSchema } from '../schemas/role'

const roleSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: false })
type RoleSpec = z.infer<typeof roleSpec>

export const getRoleById = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<RoleSpec>({
    model: 'role',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    throw new APIError('BAD_REQUEST', {
      code: 'CAN_NOT_FIND_DATA',
      message: 'Can not find data'
    })
  }
  return row
}
