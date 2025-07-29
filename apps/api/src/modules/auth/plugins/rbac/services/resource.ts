import type { AuthContext } from 'better-auth'
import { toZodSchema } from 'better-auth/db'
import type { z } from 'zod'
import { throwDataNotFoundError } from '../error-handle'
import { resourceSchema } from '../schemas/resource'

const resourceSpec = toZodSchema({ fields: resourceSchema.resource.fields, isClientSide: false })
type ResourceSpec = z.infer<typeof resourceSpec>

export const getOneResource = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<ResourceSpec>({
    model: 'resource',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}
