import { createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import type { z } from 'zod'
import { throwDataDuplicationError, throwDataNotFoundError, throwDbError } from '../error-handle'
import { roleResourceRelationSchema } from '../schemas/role-resource-relation'
import { getOneRoleResource } from '../services/role-resource-relation'

const roleResourceRelationSpec = toZodSchema({
  fields: roleResourceRelationSchema.roleResourceRelation.fields,
  isClientSide: false
})

type RoleResourceRelationSpec = z.infer<typeof roleResourceRelationSpec>

export const roleResourceRelationEndpoints = {
  createRoleResourceRelation: createAuthEndpoint(
    '/role-resource-relation/create',
    {
      method: 'POST',
      body: roleResourceRelationSpec,
      metadata: {
        openapi: {
          description: 'Create a user role relation',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'The user role relation that was created',
                    $ref: '#/components/schemas/UserRoleRelation'
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
      const { roleId, resourceId } = body
      const roleRow = await adapter.findOne({
        model: 'role',
        where: [{ field: 'id', value: roleId }]
      })
      if (!roleRow) {
        throwDataNotFoundError('Role not found')
      }
      const resourceRow = await adapter.findOne({
        model: 'resource',
        where: [{ field: 'id', value: resourceId }]
      })
      if (!resourceRow) {
        throwDataNotFoundError('Resource not found')
      }

      const row = await adapter.findOne<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [
          {
            field: 'roleId',
            value: roleId
          },
          { field: 'resourceId', value: resourceId }
        ]
      })
      if (row) {
        throwDataDuplicationError()
      }
      try {
        const result = await adapter.create<RoleResourceRelationSpec>({
          model: 'roleResourceRelation',
          data: body
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  deleteRoleResourceRelation: createAuthEndpoint(
    '/role-resource-relation/delete',
    {
      method: 'POST',
      body: roleResourceRelationSpec,
      metadata: {
        openapi: {
          description: 'Delete a role resource relation',
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
      const { roleId, resourceId } = body
      await getOneRoleResource(context, body)
      await adapter.deleteMany({
        model: 'roleResourceRelation',
        where: [
          {
            field: 'roleId',
            value: roleId
          },
          { field: 'resourceId', value: resourceId }
        ]
      })
      return json({})
    }
  )
} satisfies BetterAuthPlugin['endpoints']
