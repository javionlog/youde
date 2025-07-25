import type { AuthContext, Where } from 'better-auth'
import { APIError, createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import * as z from 'zod'
import { handleDbError } from '../error-handle'
import { pageSpec } from '../schemas/base'
import { roleSchema } from '../schemas/role'
import { isEmpty } from '../utils'

const roleSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: false })
const roleClientSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: true })

const roleFindSpec = z.object({
  ...pageSpec.shape,
  name: z.string().nullish()
})

type RoleSpec = z.infer<typeof roleSpec>

const getRoleById = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<RoleSpec>({
    model: 'role',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    throw new APIError('BAD_REQUEST', {
      code: 'CAN_NOT_FIND_DATA',
      message: 'Can not find data'
    })
  }
  return row
}

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
    async ({ body, json, context }) => {
      const { adapter } = context
      try {
        const result = await adapter.create<RoleSpec>({ model: 'role', data: body })
        return json(result)
      } catch (err) {
        handleDbError(err)
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
    async ({ body, json, context }) => {
      const { id } = body
      const { adapter } = context
      await getRoleById(context, id)
      const result = await adapter.update<RoleSpec>({
        model: 'role',
        where: [{ field: 'id', value: id }],
        update: {
          ...body,
          updatedAt: new Date()
        }
      })
      return json(result)
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
                    type: 'string',
                    description: 'The role id that was deleted'
                  }
                }
              }
            }
          }
        }
      }
    },
    async ({ body, json, context }) => {
      const { adapter } = context
      const { id } = body
      await getRoleById(context, id)
      await adapter.delete({
        model: 'role',
        where: [{ field: 'id', value: id }]
      })
      return json({ id })
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
    async ({ query, json, context }) => {
      const { id } = query
      const row = await getRoleById(context, id)
      return json(row)
    }
  ),
  listRoles: createAuthEndpoint(
    '/role/list',
    {
      method: 'POST',
      body: roleFindSpec,
      metadata: {
        openapi: {
          description: 'Find roles',
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
    async ({ body, json, context: { adapter } }) => {
      const { name, page, pageSize } = body
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
        limit
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
