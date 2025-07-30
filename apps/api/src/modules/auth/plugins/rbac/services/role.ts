import type { AuthContext } from 'better-auth'
import type { z } from 'zod'
import { throwDataNotFoundError } from '../errors'
import { roleSchema } from '../schemas/role'
import { getZodSchema } from '../utils'

const roleSpec = getZodSchema({ fields: roleSchema.role.fields, isClientSide: false })
type RoleSpec = z.infer<typeof roleSpec>

export const getOneRole = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<RoleSpec>({
    model: 'role',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}
