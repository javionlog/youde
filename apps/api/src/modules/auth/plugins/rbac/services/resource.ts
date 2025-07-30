import type { AuthContext } from 'better-auth'
import type { z } from 'zod'
import { throwDataNotFoundError } from '../errors'
import { resourceSchema } from '../schemas/resource'
import { getZodSchema } from '../utils'

const resourceSpec = getZodSchema({ fields: resourceSchema.resource.fields, isClientSide: false })
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
