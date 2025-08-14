import type { AuthContext } from 'better-auth'
import { z } from 'zod'
import { throwDataNotFoundError } from '../errors'
import { roleSchema } from '../schemas/role'
import { pageSpec, sortBySpec } from '../specs'
import { getZodSchema } from '../utils'

export const roleSpec = getZodSchema({ fields: roleSchema.role.fields, isClientSide: false })
export const roleClientSpec = getZodSchema({ fields: roleSchema.role.fields, isClientSide: true })
export const roleListSpec = z.object({
  ...pageSpec.shape,
  ...sortBySpec.shape,
  name: z.string().nullish()
})

export type RoleSpec = z.infer<typeof roleSpec> & { id: string }
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
