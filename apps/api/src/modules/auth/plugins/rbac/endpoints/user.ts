import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { z } from 'zod'
import { buildTree, getOpenAPISchema, isEmpty } from '@/global/utils'
import { basePath } from '../config'
import { getSession } from '../services/base'
import { relationListSpec } from '../services/relation'
import type { ResourceSpec } from '../services/resource'
import type { ResourceLocaleSpec } from '../services/resource-locale'
import type { RoleResourceRelationSpec } from '../services/role-resource-relation'
import type { UserSpec } from '../services/user'
import { getOneUser } from '../services/user'
import type { UserRoleRelationSpec } from '../services/user-role-relation'
import { idSpec, pageSpec } from '../specs'

export const userEndpoints = {
  getUserResourceTree: createAuthEndpoint(
    `${basePath}/get-user-resource-tree`,
    {
      method: 'POST',
      metadata: {
        openapi: {
          description: 'Get user resource tree',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ResourceNode'
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
      const session = await getSession(ctx)
      const { json, context } = ctx
      const { adapter } = context
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'userId', value: session?.user.id! }]
      })
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'roleId', value: userRoleRelationRows.map(o => o.roleId), operator: 'in' }]
      })
      const where: Where[] = [
        { field: 'id', value: roleResourceRelationRows.map(row => row.resourceId), operator: 'in' },
        { field: 'enabled', value: true }
      ]
      const resourceRecords = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        sortBy: {
          field: 'sort',
          direction: 'asc'
        }
      })
      const resourceIds = resourceRecords.map(o => o.id)
      const localeRecords = await adapter.findMany<ResourceLocaleSpec>({
        model: 'resourceLocale',
        where: [
          {
            field: 'resourceId',
            value: resourceIds,
            operator: 'in'
          }
        ]
      })
      const records = resourceRecords.map(item => {
        return {
          ...item,
          locales: localeRecords.filter(localeItem => {
            return item.id === localeItem.resourceId
          })
        }
      }) as (ResourceSpec & {
        locales: ResourceLocaleSpec[]
      })[]
      const tree = buildTree(records)
      return json(tree)
    }
  ),
  listUsers: createAuthEndpoint(
    `${basePath}/list-users`,
    {
      method: 'POST',
      body: z.object({
        ...relationListSpec.pick({ username: true, sortBy: true }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List users',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({ username: true, sortBy: true }).shape,
                    ...pageSpec.shape
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
                    properties: {
                      records: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
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
      const { username, sortBy, page, pageSize } = body
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = []
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
        limit,
        sortBy
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
  ),
  deleteUser: createAuthEndpoint(
    `${basePath}/user/delete`,
    {
      method: 'POST',
      body: idSpec,
      metadata: {
        openapi: {
          description: 'Delete a user',
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
      await getOneUser(context, id)
      await adapter.delete({
        model: 'role',
        where: [{ field: 'id', value: id }]
      })
      return json({})
    }
  )
}
