import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { buildTree, getOpenAPISchema, isEmpty } from '@/global/utils'
import { basePath } from '../config'
import { throwDbError } from '../errors'
import { getSession } from '../services/base'
import type { ResourceSpec } from '../services/resource'
import type { ResourceLocaleSpec } from '../services/resource-locale'
import type { RoleResourceRelationSpec } from '../services/role-resource-relation'
import type { UserSpec } from '../services/user'
import { checkEmail, checkUsername, getOneUser, userListSpec, userSpec } from '../services/user'
import type { UserRoleRelationSpec } from '../services/user-role-relation'
import { idSpec } from '../specs'

export const userEndpoints = {
  createUser: createAuthEndpoint(
    `${basePath}/user/create`,
    {
      method: 'POST',
      body: userSpec,
      metadata: {
        openapi: {
          description: 'Create a user',
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    $ref: '#/components/schemas/User'
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
      const { internalAdapter, password } = context
      const hashPassword = await password.hash(body.password)
      await checkUsername(context, body.username)
      await checkEmail(context, body.email)
      try {
        const result = await internalAdapter.createUser(body)
        await internalAdapter.linkAccount({
          userId: result.id,
          providerId: 'credential',
          accountId: result.id,
          password: hashPassword
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  delUser: createAuthEndpoint(
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
      const { internalAdapter } = context
      const { id } = body
      await getOneUser(context, id)
      await internalAdapter.deleteUser(id)
      await internalAdapter.deleteSessions(id)
      await internalAdapter.deleteAccounts(id)
      return json({})
    }
  ),
  listUsers: createAuthEndpoint(
    `${basePath}/user/list`,
    {
      method: 'POST',
      body: userListSpec,
      metadata: {
        openapi: {
          description: 'List users',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(userListSpec)
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
      const { username, displayUsername, email, sortBy, page, pageSize } = body
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
      if (!isEmpty(displayUsername)) {
        where.push({
          field: 'displayUsername',
          value: displayUsername,
          operator: 'contains'
        })
      }
      if (!isEmpty(email)) {
        where.push({
          field: 'email',
          value: email,
          operator: 'contains'
        })
      }
      const records = await adapter.findMany<Omit<UserSpec, 'password'>>({
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
  )
}
