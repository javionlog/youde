import { createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { handleDbError } from '../error-handle'
import { roleSchema } from '../schemas/role'

const body = toZodSchema({ fields: roleSchema.role.fields, isClientSide: true })

export const roleEndpoints = {
  createRole: createAuthEndpoint(
    '/role/create',
    {
      method: 'POST',
      body,
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
        const result = await adapter.create({ model: 'role', data: body })
        return json(result)
      } catch (err) {
        handleDbError(err)
      }
    }
  )
} satisfies BetterAuthPlugin['endpoints']
