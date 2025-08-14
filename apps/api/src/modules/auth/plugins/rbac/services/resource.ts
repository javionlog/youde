import type { AuthContext } from 'better-auth'
import { z } from 'zod'
import { throwDataNotFoundError } from '../errors'
import { resourceSchema } from '../schemas/resource'
import { pageSpec, sortBySpec } from '../specs'
import { getZodSchema } from '../utils'

export const resourceSpec = getZodSchema({
  fields: resourceSchema.resource.fields,
  isClientSide: false
})

export const resourceClientSpec = getZodSchema({
  fields: resourceSchema.resource.fields,
  isClientSide: true
})

export const resourceListSpec = z.object({
  ...pageSpec.shape,
  ...sortBySpec.shape,
  name: z.string().nullish()
})

export type ResourceSpec = z.infer<typeof resourceSpec> & { id: string }

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
