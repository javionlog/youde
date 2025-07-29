import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { throwDataIsReferencedError, throwDbError } from '../error-handle'
import { pageSpec } from '../schemas/base'
import { resourceSchema } from '../schemas/resource'
import { roleResourceRelationSchema } from '../schemas/role-resource-relation'
import { getSession } from '../services/base'
import { getOneResource } from '../services/resource'
import { getOpenAPISchema, isEmpty } from '../utils'

const resourceSpec = toZodSchema({ fields: resourceSchema.resource.fields, isClientSide: false })
const resourceClientSpec = toZodSchema({
  fields: resourceSchema.resource.fields,
  isClientSide: true
})

const resourceListSpec = z.object({
  ...pageSpec.shape,
  name: z.string().nullish(),
  sortBy: z
    .object({
      field: resourceSpec.keyof().default('updatedAt'),
      direction: z.enum(['asc', 'desc']).default('desc')
    })
    .optional()
})

const roleResourceRelationSpec = toZodSchema({
  fields: roleResourceRelationSchema.roleResourceRelation.fields,
  isClientSide: false
})

type ResourceSpec = z.infer<typeof resourceSpec>
type RoleResourceRelationSpec = z.infer<typeof roleResourceRelationSpec>

export const resourceEndpoints = {
  createResource: createAuthEndpoint(
    '/resource/create',
    {
      method: 'POST',
      body: resourceClientSpec,
      metadata: {
        openapi: {
          description: 'Create a resource',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The resource that was created',
                    $ref: '#/components/schemas/Resource'
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
      try {
        const result = await adapter.create<ResourceSpec>({
          model: 'resource',
          data: {
            ...body,
            createdBy: session?.user.username,
            updatedBy: session?.user.username
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  updateResource: createAuthEndpoint(
    '/resource/update',
    {
      method: 'POST',
      body: z.object({
        ...resourceClientSpec.shape,
        id: z.string()
      }),
      metadata: {
        openapi: {
          description: 'Update a resource',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The resource that was updated',
                    $ref: '#/components/schemas/Resource'
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
      await getOneResource(context, id)
      try {
        const result = await adapter.update<ResourceSpec>({
          model: 'resource',
          where: [{ field: 'id', value: id }],
          update: {
            ...body,
            updatedAt: new Date(),
            updatedBy: session?.user.username
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  deleteResource: createAuthEndpoint(
    '/resource/delete',
    {
      method: 'POST',
      body: z.object({
        id: z.string()
      }),
      metadata: {
        openapi: {
          description: 'Delete a resource',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'Empty object'
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
      await getOneResource(context, id)
      const roleResourceRelationRows = await adapter.findOne<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'resourceId', value: id }]
      })
      if (roleResourceRelationRows) {
        throwDataIsReferencedError('Resource is referenced')
      }
      await adapter.delete({
        model: 'resource',
        where: [{ field: 'id', value: id }]
      })
      return json({})
    }
  ),
  deleteManyResources: createAuthEndpoint(
    '/resource/delete-many',
    {
      method: 'POST',
      body: z.object({
        ids: z.array(z.string())
      }),
      metadata: {
        openapi: {
          description: 'Delete many resources',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'Empty object'
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
        model: 'resource',
        where: [{ field: 'id', value: ids, operator: 'in' }]
      })
      return json({})
    }
  ),
  getResource: createAuthEndpoint(
    '/resource/get',
    {
      method: 'GET',
      query: z.object({
        id: z.string()
      }),
      metadata: {
        openapi: {
          description: 'Get a resource',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The resource that was found',
                    $ref: '#/components/schemas/Resource'
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
      const row = await getOneResource(context, id)
      return json(row)
    }
  ),
  listResources: createAuthEndpoint(
    '/resource/list',
    {
      method: 'POST',
      body: resourceListSpec,
      metadata: {
        openapi: {
          description: 'List resources',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(resourceListSpec)
              }
            }
          },
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    description: 'Resources that match conditions',
                    items: {
                      $ref: '#/components/schemas/Resource'
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
      const { name, sortBy = { field: 'updatedAt', direction: 'desc' }, page, pageSize } = body
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = []
      if (!isEmpty(name)) {
        where.push({
          field: 'name',
          value: name,
          operator: 'contains'
        })
      }
      const records = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        offset,
        limit,
        sortBy
      })
      const total = await adapter.count({
        model: 'resource',
        where
      })
      return json({
        records,
        total
      })
    }
  )
} satisfies BetterAuthPlugin['endpoints']
