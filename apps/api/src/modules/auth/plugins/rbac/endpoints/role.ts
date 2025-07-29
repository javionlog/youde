import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { throwDbError } from '../error-handle'
import { pageSpec } from '../schemas/base'
import { roleSchema } from '../schemas/role'
import { getSession } from '../services/base'
import { getOneRole } from '../services/role'
import { getOpenAPISchema, isEmpty } from '../utils'

const roleSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: false })
const roleClientSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: true })

const roleListSpec = z.object({
  ...pageSpec.shape,
  name: z.string().nullish(),
  sortBy: z
    .object({
      field: roleSpec.keyof().default('updatedAt'),
      direction: z.enum(['asc', 'desc']).default('desc')
    })
    .optional()
})

type RoleSpec = z.infer<typeof roleSpec>

export const roleEndpoints = {
  createRole: createAuthEndpoint(
    '/role/create',
    {
      method: 'POST',
      body: roleClientSpec,
      metadata: {
        openapi: {
          description: 'Create a role',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The role that was created',
                    $ref: '#/components/schemas/Role'
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
        const result = await adapter.create<RoleSpec>({
          model: 'role',
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
  updateRole: createAuthEndpoint(
    '/role/update',
    {
      method: 'POST',
      body: z.object({
        ...roleClientSpec.shape,
        id: z.string()
      }),
      metadata: {
        openapi: {
          description: 'Update a role',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The role that was updated',
                    $ref: '#/components/schemas/Role'
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
      await getOneRole(context, id)
      try {
        const result = await adapter.update<RoleSpec>({
          model: 'role',
          where: [{ field: 'id', value: id }],
          update: {
            ...body,
            updatedAt: new Date(),
            updatedBy: session?.user.name
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  deleteRole: createAuthEndpoint(
    '/role/delete',
    {
      method: 'POST',
      body: z.object({
        id: z.string()
      }),
      metadata: {
        openapi: {
          description: 'Delete a role',
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
      await getOneRole(context, id)
      await adapter.delete({
        model: 'role',
        where: [{ field: 'id', value: id }]
      })
      return json({})
    }
  ),
  deleteManyRoles: createAuthEndpoint(
    '/role/delete-many',
    {
      method: 'POST',
      body: z.object({
        ids: z.array(z.string())
      }),
      metadata: {
        openapi: {
          description: 'Delete many roles',
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
        model: 'role',
        where: [{ field: 'id', value: ids, operator: 'in' }]
      })
      return json({})
    }
  ),
  getRole: createAuthEndpoint(
    '/role/get',
    {
      method: 'GET',
      query: z.object({
        id: z.string()
      }),
      metadata: {
        openapi: {
          description: 'Get a role',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The role that was found',
                    $ref: '#/components/schemas/Role'
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
      const row = await getOneRole(context, id)
      return json(row)
    }
  ),
  listRoles: createAuthEndpoint(
    '/role/list',
    {
      method: 'POST',
      body: roleListSpec,
      metadata: {
        openapi: {
          description: 'List roles',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(roleListSpec)
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
                    description: 'Roles that match conditions',
                    items: {
                      $ref: '#/components/schemas/Role'
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
      const records = await adapter.findMany<RoleSpec>({
        model: 'role',
        where,
        offset,
        limit,
        sortBy
      })
      const total = await adapter.count({
        model: 'role',
        where
      })
      return json({
        records,
        total
      })
    }
  )
} satisfies BetterAuthPlugin['endpoints']
