import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { basePath } from '../config'
import { throwDataIsReferencedError, throwDbError } from '../errors'
import { getSession } from '../services/base'
import type { ResourceSpec } from '../services/resource'
import { getOneResource, resourceClientSpec, resourceListSpec } from '../services/resource'
import type { RoleResourceRelationSpec } from '../services/role-resource-relation'
import { idSpec } from '../specs'
import { getOpenAPISchema, isEmpty } from '../utils'

export const resourceEndpoints = {
  createResource: createAuthEndpoint(
    `${basePath}/resource/create`,
    {
      method: 'POST',
      body: resourceClientSpec,
      metadata: {
        openapi: {
          description: 'Create a resource',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(resourceClientSpec)
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
    `${basePath}/resource/update`,
    {
      method: 'POST',
      body: z.object({
        ...resourceClientSpec.shape,
        ...idSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'Update a resource',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...resourceClientSpec.shape,
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
    `${basePath}/resource/delete`,
    {
      method: 'POST',
      body: idSpec,
      metadata: {
        openapi: {
          description: 'Delete a resource',
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
    `${basePath}/resource/delete-many`,
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
      const canDeleteIds = []
      for (const id of ids) {
        await getOneResource(context, id)
        const roleResourceRelationRows = await adapter.findOne<RoleResourceRelationSpec>({
          model: 'roleResourceRelation',
          where: [{ field: 'resourceId', value: id }]
        })
        if (!roleResourceRelationRows) {
          canDeleteIds.push(id)
        }
      }
      await adapter.deleteMany({
        model: 'resource',
        where: [{ field: 'id', value: canDeleteIds, operator: 'in' }]
      })
      return json({})
    }
  ),
  getResource: createAuthEndpoint(
    `${basePath}/resource/get`,
    {
      method: 'GET',
      query: idSpec,
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
    `${basePath}/resource/list`,
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
      const { name, sortBy, page, pageSize } = body
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
