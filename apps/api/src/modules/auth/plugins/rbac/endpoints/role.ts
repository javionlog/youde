import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { getOpenAPISchema, isEmpty } from '@/global/utils'
import { basePath, systemOperator } from '../config'
import { throwDataIsReferencedError, throwDbError } from '../errors'
import { getSession } from '../services/base'
import type { RoleSpec } from '../services/role'
import { getOneRole, roleClientSpec, roleListSpec } from '../services/role'
import type { UserRoleRelationSpec } from '../services/user-role-relation'
import { idSpec } from '../specs'

export const roleEndpoints = {
  createRole: createAuthEndpoint(
    `${basePath}/role/create`,
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
            createdBy: session?.user.username ?? systemOperator,
            updatedBy: session?.user.username ?? systemOperator
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  updateRole: createAuthEndpoint(
    `${basePath}/role/update`,
    {
      method: 'POST',
      body: z.object({
        ...roleClientSpec.shape,
        ...idSpec.shape
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
            updatedAt: new Date().toISOString(),
            updatedBy: session?.user.username ?? systemOperator
          }
        })
        return json(result)
      } catch (err) {
        throwDbError(err)
      }
    }
  ),
  deleteRole: createAuthEndpoint(
    `${basePath}/role/delete`,
    {
      method: 'POST',
      body: idSpec,
      metadata: {
        openapi: {
          description: 'Delete a role',
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
      await getOneRole(context, id)
      const userRoleRelationRows = await adapter.findOne<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'roleId', value: id }]
      })
      if (userRoleRelationRows) {
        throwDataIsReferencedError('Role is referenced')
      }
      await adapter.delete({
        model: 'role',
        where: [{ field: 'id', value: id }]
      })
      return json({})
    }
  ),
  deleteManyRoles: createAuthEndpoint(
    `${basePath}/role/delete-many`,
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
        const userRoleRelationRows = await adapter.findOne<UserRoleRelationSpec>({
          model: 'userRoleRelation',
          where: [{ field: 'roleId', value: id }]
        })
        if (!userRoleRelationRows) {
          canDeleteIds.push(id)
        }
      }
      await adapter.deleteMany({
        model: 'role',
        where: [{ field: 'id', value: canDeleteIds, operator: 'in' }]
      })
      return json({})
    }
  ),
  getRole: createAuthEndpoint(
    `${basePath}/role/get`,
    {
      method: 'GET',
      query: idSpec,
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
    `${basePath}/role/list`,
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
                    type: 'object',
                    properties: {
                      records: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Role'
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
      const { name, enabled, sortBy, page, pageSize } = body
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
      if (!isEmpty(enabled)) {
        where.push({
          field: 'enabled',
          value: enabled
        })
      }
      const records = await adapter.findMany<RoleSpec>({
        model: 'role',
        where,
        offset,
        limit,
        sortBy: { field: sortBy?.field ?? 'updatedAt', direction: sortBy?.direction ?? 'desc' }
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
