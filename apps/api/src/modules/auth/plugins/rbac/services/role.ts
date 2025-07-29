import type { AuthContext } from 'better-auth'
import { toZodSchema } from 'better-auth/db'
import type { z } from 'zod'
import { throwDataNotFoundError } from '../error-handle'
import { roleSchema } from '../schemas/role'

const roleSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: false })
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
