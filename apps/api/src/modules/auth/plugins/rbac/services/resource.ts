import type { AuthContext } from 'better-auth'
import { APIError } from 'better-auth/api'
import { z } from 'zod'
import { getZodSchema } from '@/global/utils'
import { throwDataNotFoundError } from '../errors'
import { resourceSchema } from '../schemas/resource'
import { pageSpec, sortBySpec } from '../specs'
import type { ResourceLocaleSpec } from './resource-locale'

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

export const getOneResource = async (ctx: AuthContext, id: string, message?: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<ResourceSpec>({
    model: 'resource',
    where: [{ field: 'id', value: id }]
  })
  const localeRecords = await adapter.findMany<ResourceLocaleSpec>({
    model: 'resourceLocale',
    where: [{ field: 'resourceId', value: id }]
  })
  if (!row) {
    return throwDataNotFoundError(message)
  }
  const result = row as ResourceSpec & {
    locales: ResourceLocaleSpec[]
  }
  if (localeRecords) {
    result.locales = localeRecords
  }
  return result
}

export const getChildrenResource = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<ResourceSpec>({
    model: 'resource',
    where: [{ field: 'parentId', value: id }]
  })
  if (row) {
    throw new APIError('BAD_REQUEST', {
      code: 'Resource_HAS_CHILDREN',
      message: 'Resource has children'
    })
  }
  return row
}

export const checkResource = async (ctx: AuthContext, body: z.infer<typeof resourceClientSpec>) => {
  if (body.type === 'Page') {
    if (body.path === undefined) {
      throw new APIError('BAD_REQUEST', {
        code: 'PAGE_PATH_REQUIRED',
        message: 'Page path required'
      })
    }
  }
  if (body.type === 'Element') {
    if (body.parentId === undefined) {
      throw new APIError('BAD_REQUEST', {
        code: 'ELEMENT_PARENT_ID_REQUIRED',
        message: 'Element parent ID required'
      })
    }
    const row = await getOneResource(ctx, body.parentId, 'Parent not found')
    if (row.type !== 'Page') {
      throw new APIError('BAD_REQUEST', {
        code: 'ELEMENT_PARENT_MUST_BE_PAGE',
        message: 'Element parent must be page'
      })
    }
  }
}
