import type { AuthContext } from 'better-auth'
import { z } from 'zod'
import { getZodSchema } from '@/global/utils'
import { throwDataNotFoundError } from '../errors'
import { resourceLocaleSchema } from '../schemas/resource-locale'
import { pageSpec, sortBySpec } from '../specs'

export const resourceLocaleSpec = getZodSchema({
  fields: resourceLocaleSchema.resourceLocale.fields,
  isClientSide: false
})

export const resourceLocaleClientSpec = getZodSchema({
  fields: resourceLocaleSchema.resourceLocale.fields,
  isClientSide: true
})

export const resourceLocaleListSpec = z.object({
  ...pageSpec.shape,
  ...sortBySpec.shape,
  field: z.string().nullish()
})

export type ResourceLocaleSpec = z.infer<typeof resourceLocaleSpec> & { id: string }

export const getOneResourceLocale = async (ctx: AuthContext, id: string, message?: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<ResourceLocaleSpec>({
    model: 'resourceLocale',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    return throwDataNotFoundError(message)
  }
  return row
}
