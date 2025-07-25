import { type Where, z } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
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
    async ({ body, json, context: { adapter } }) => {
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
    async ({ body, json, context: { adapter } }) => {
      try {
        const { id } = body
        const result = await adapter.update<RoleSpec>({
          model: 'role',
          where: [{ field: 'id', value: id }],
          update: {
            role: body
          }
        })
        return json(result)
      } catch (err) {
        handleDbError(err)
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
    async ({ body, json, context: { adapter } }) => {
      try {
        const { id } = body
        await adapter.delete({
          model: 'role',
          where: [{ field: 'id', value: id }]
        })
        return json({ id })
      } catch (err) {
        handleDbError(err)
      }
    }
  ),
  findRole: createAuthEndpoint(
    '/role/find',
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
      try {
        const { name, offset, limit } = body
        const where: Where[] = []
        if (!isEmpty(name)) {
          where.push({
            field: 'name',
            value: name,
            operator: 'contains'
          })
        }
        const result = await adapter.findMany<RoleSpec>({
          model: 'role',
          where,
          offset,
          limit
        })
        return json(result)
      } catch (err) {
        handleDbError(err)
      }
    }
  )
} satisfies BetterAuthPlugin['endpoints']
