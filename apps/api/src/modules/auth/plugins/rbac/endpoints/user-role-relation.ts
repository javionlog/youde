import type { User, Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { toZodSchema } from 'better-auth/db'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { throwDataDuplicationError, throwDataNotFoundError, throwDbError } from '../error-handle'
import { pageSpec } from '../schemas/base'
import { roleSchema } from '../schemas/role'
import { userRoleRelationSchema } from '../schemas/user-role-relation'
import { getOneUserRole } from '../services/user-role-relation'
import { getOpenAPISchema, isEmpty } from '../utils'

const roleSpec = toZodSchema({ fields: roleSchema.role.fields, isClientSide: false })

const userRoleRelationSpec = toZodSchema({
  fields: userRoleRelationSchema.userRoleRelation.fields,
  isClientSide: false
})

const userRoleRelationListSpec = z.object({
  ...pageSpec.shape,
  ...userRoleRelationSpec.shape,
  roleName: z.string().nullish(),
  username: z.string().nullish()
})

type UserSpec = User & { username?: string }
type RoleSpec = z.infer<typeof roleSpec>
type UserRoleRelationSpec = z.infer<typeof userRoleRelationSpec>

export const userRoleRelationEndpoints = {
  createUserRoleRelation: createAuthEndpoint(
    '/user-role-relation/create',
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
    '/user-role-relation/delete',
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
  listUserRoles: createAuthEndpoint(
    '/list-user-roles',
    {
      method: 'POST',
      body: userRoleRelationListSpec.omit({ roleId: true, username: true }),
      metadata: {
        openapi: {
          description: 'List user roles',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  userRoleRelationListSpec.omit({ roleId: true, username: true })
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
                    type: 'array',
                    description: 'User roles that match conditions',
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
      const { userId, roleName, page, pageSize } = body
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'userId', value: userId }]
      })
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = [
        { field: 'id', value: userRoleRelationRows.map(row => row.roleId), operator: 'in' }
      ]
      if (!isEmpty(roleName)) {
        where.push({
          field: 'name',
          value: roleName,
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
  ),
  listRoleUsers: createAuthEndpoint(
    '/list-role-users',
    {
      method: 'POST',
      body: userRoleRelationListSpec.omit({ userId: true, roleName: true }),
      metadata: {
        openapi: {
          description: 'List role users',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  userRoleRelationListSpec.omit({ userId: true, roleName: true })
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
                    type: 'array',
                    description: 'Role users that match conditions',
                    items: {
                      $ref: '#/components/schemas/User'
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
      const { roleId, username, page, pageSize } = body
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'roleId', value: roleId }]
      })
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = [
        { field: 'id', value: userRoleRelationRows.map(row => row.userId), operator: 'in' }
      ]
      if (!isEmpty(username)) {
        where.push({
          field: 'username',
          value: username,
          operator: 'contains'
        })
      }
      const records = await adapter.findMany<UserSpec>({
        model: 'user',
        where,
        offset,
        limit
      })
      const total = await adapter.count({
        model: 'user',
        where
      })
      return json({
        records,
        total
      })
    }
  )
} satisfies BetterAuthPlugin['endpoints']
