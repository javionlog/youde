import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { basePath } from '../config'
import { throwDataDuplicationError, throwDataNotFoundError, throwDbError } from '../errors'
import { userRoleRelationSchema } from '../schemas/user-role-relation'
import { getOneUserRole } from '../services/user-role-relation'
import { pageSpec } from '../specs'
import { getOpenAPISchema, getZodSchema, isEmpty } from '../utils'

const userRoleRelationSpec = getZodSchema({
  fields: userRoleRelationSchema.userRoleRelation.fields,
  isClientSide: false
})

const userRoleRelationListSpec = z.object({
  ...pageSpec.shape,
  ...userRoleRelationSpec.partial().shape
})

type UserRoleRelationSpec = z.infer<typeof userRoleRelationSpec>

export const userRoleRelationEndpoints = {
  createUserRoleRelation: createAuthEndpoint(
    `${basePath}/user-role-relation/create`,
    {
      method: 'POST',
      body: userRoleRelationSpec,
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
      const { adapter, internalAdapter } = context
      const { userId, roleId } = body
      const userRow = await internalAdapter.findUserById(userId)
      if (!userRow) {
        throwDataNotFoundError('User not found')
      }
      const roleRow = await adapter.findOne({
        model: 'role',
        where: [{ field: 'id', value: roleId }]
      })
      if (!roleRow) {
        throwDataNotFoundError('Role not found')
      }

      const row = await adapter.findOne<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [
          { field: 'userId', value: userId },
          {
            field: 'roleId',
            value: roleId
          }
        ]
      })
      if (row) {
        throwDataDuplicationError()
      }
      try {
        const result = await adapter.create<UserRoleRelationSpec>({
          model: 'userRoleRelation',
          data: body
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  deleteUserRoleRelation: createAuthEndpoint(
    `${basePath}/user-role-relation/delete`,
    {
      method: 'POST',
      body: userRoleRelationSpec,
      metadata: {
        openapi: {
          description: 'Delete a user role relation',
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
      const { userId, roleId } = body
      await getOneUserRole(context, body)
      await adapter.deleteMany({
        model: 'userRoleRelation',
        where: [
          { field: 'userId', value: userId },
          {
            field: 'roleId',
            value: roleId
          }
        ]
      })
      return json({})
    }
  ),
  listUserRoleRelations: createAuthEndpoint(
    `${basePath}/user-role-relation/list`,
    {
      method: 'POST',
      body: userRoleRelationListSpec,
      metadata: {
        openapi: {
          description: 'List role resource relations',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(userRoleRelationListSpec)
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
                      $ref: '#/components/schemas/UserRoleRelation'
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
      const { roleId, userId, page, pageSize } = body
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = []
      if (!isEmpty(roleId)) {
        where.push({
          field: 'roleId',
          value: roleId
        })
      }
      if (!isEmpty(userId)) {
        where.push({
          field: 'userId',
          value: userId
        })
      }
      const records = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where,
        offset,
        limit
      })
      const total = await adapter.count({
        model: 'userRoleRelation',
        where
      })
      return json({
        records,
        total
      })
    }
  )
} satisfies BetterAuthPlugin['endpoints']
