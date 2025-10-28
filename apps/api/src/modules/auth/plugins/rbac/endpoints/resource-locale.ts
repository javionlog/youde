import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { getOpenAPISchema, isEmpty } from '@/global/utils'
import { basePath, systemOperator } from '../config'
import { throwDataDuplicationError, throwDbError } from '../errors'
import { getSession } from '../services/base'
import type { ResourceLocaleSpec } from '../services/resource-locale'
import {
  getOneResourceLocale,
  resourceLocaleClientSpec,
  resourceLocaleListSpec
} from '../services/resource-locale'
import { idSpec } from '../specs'

export const resourceLocaleEndpoints = {
  createResourceLocale: createAuthEndpoint(
    `${basePath}/resource-locale/create`,
    {
      method: 'POST',
      body: resourceLocaleClientSpec,
      metadata: {
        openapi: {
          description: 'Create a resource locale',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(resourceLocaleClientSpec)
              }
            }
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    $ref: '#/components/schemas/ResourceLocale'
                  }
                }
              }
            }
          }
        }
      }
    },
    async ctx => {
      const { body, json, context } = ctx
      const { adapter } = context
      const session = await getSession(ctx)

      const row = await adapter.findOne<ResourceLocaleSpec>({
        model: 'resourceLocale',
        where: [
          { field: 'field', value: body.field },
          { field: 'resourceId', value: body.resourceId }
        ]
      })
      if (row) {
        throwDataDuplicationError()
      }
      try {
        const result = await adapter.create<ResourceLocaleSpec>({
          model: 'resourceLocale',
          data: {
            ...body,
            createdBy: session?.user.username ?? systemOperator,
            updatedBy: session?.user.username ?? systemOperator
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  updateResourceLocale: createAuthEndpoint(
    `${basePath}/resource-locale/update`,
    {
      method: 'POST',
      body: z.object({
        ...resourceLocaleClientSpec.shape,
        ...idSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'Update a resource locale',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...resourceLocaleClientSpec.shape,
                    ...idSpec.shape
                  })
                )
              }
            }
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    $ref: '#/components/schemas/ResourceLocale'
                  }
                }
              }
            }
          }
        }
      }
    },
    async ctx => {
      const { body, json, context } = ctx
      const { id } = body
      const { adapter } = context
      const session = await getSession(ctx)
      await getOneResourceLocale(context, id)
      try {
        const result = await adapter.update<ResourceLocaleSpec>({
          model: 'resourceLocale',
          where: [{ field: 'id', value: id }],
          update: {
            ...body,
            updatedAt: new Date(),
            updatedBy: session?.user.username ?? systemOperator
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  deleteResourceLocale: createAuthEndpoint(
    `${basePath}/resource-locale/delete`,
    {
      method: 'POST',
      body: idSpec,
      metadata: {
        openapi: {
          description: 'Delete a resource locale',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      }
    },
    async ctx => {
      const { body, json, context } = ctx
      const { adapter } = context
      const { id } = body
      await getOneResourceLocale(context, id)
      await adapter.delete({
        model: 'resourceLocale',
        where: [{ field: 'id', value: id }]
      })
      return json({})
    }
  ),
  deleteManyResourceLocales: createAuthEndpoint(
    `${basePath}/resource-locale/delete-many`,
    {
      method: 'POST',
      body: z.object({
        ids: z.array(z.string())
      }),
      metadata: {
        openapi: {
          description: 'Delete many resource locales',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      }
    },
    async ctx => {
      const { body, json, context } = ctx
      const { adapter } = context
      const { ids } = body
      await adapter.deleteMany({
        model: 'resourceLocale',
        where: [{ field: 'id', value: ids, operator: 'in' }]
      })
      return json({})
    }
  ),
  getResourceLocale: createAuthEndpoint(
    `${basePath}/resource-locale/get`,
    {
      method: 'GET',
      query: idSpec,
      metadata: {
        openapi: {
          description: 'Get a resource locale',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    $ref: '#/components/schemas/ResourceLocale'
                  }
                }
              }
            }
          }
        }
      }
    },
    async ctx => {
      const { query, json, context } = ctx
      const { id } = query
      const row = await getOneResourceLocale(context, id)
      return json(row)
    }
  ),
  listResourceLocales: createAuthEndpoint(
    `${basePath}/resource-locale/list`,
    {
      method: 'POST',
      body: resourceLocaleListSpec,
      metadata: {
        openapi: {
          description: 'List resource locales',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(resourceLocaleListSpec)
              }
            }
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      records: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/ResourceLocale'
                        }
                      },
                      total: {
                        type: 'number'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async ctx => {
      const { body, json, context } = ctx
      const { adapter } = context
      const { field, sortBy, page, pageSize } = body
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = []
      if (!isEmpty(field)) {
        where.push({
          field: 'field',
          value: field,
          operator: 'contains'
        })
      }
      const records = await adapter.findMany<ResourceLocaleSpec>({
        model: 'resourceLocale',
        where,
        offset,
        limit,
        sortBy: { field: sortBy?.field ?? 'updatedAt', direction: sortBy?.direction ?? 'desc' }
      })
      const total = await adapter.count({
        model: 'resourceLocale',
        where
      })
      return json({
        records,
        total
      })
    }
  )
} satisfies BetterAuthPlugin['endpoints']
