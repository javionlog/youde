import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { basePath } from '../config'
import { throwDataDuplicationError, throwDataNotFoundError, throwDbError } from '../errors'
import type { RoleResourceRelationSpec } from '../services/role-resource-relation'
import {
  getOneRoleResource,
  roleResourceRelationListSpec,
  roleResourceRelationSpec
} from '../services/role-resource-relation'
import { getOpenAPISchema, isEmpty } from '../utils'

export const roleResourceRelationEndpoints = {
  createRoleResourceRelation: createAuthEndpoint(
    `${basePath}/role-resource-relation/create`,
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
    `${basePath}/role-resource-relation/delete`,
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
  ),
  listRoleResourceRelations: createAuthEndpoint(
    `${basePath}/role-resource-relation/list`,
    {
      method: 'POST',
      body: roleResourceRelationListSpec,
      metadata: {
        openapi: {
          description: 'List role resource relations',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(roleResourceRelationListSpec)
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
                      $ref: '#/components/schemas/RoleResourceRelation'
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
      const { roleId, resourceId, page, pageSize } = body
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
      if (!isEmpty(resourceId)) {
        where.push({
          field: 'resourceId',
          value: resourceId
        })
      }
      const records = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where,
        offset,
        limit
      })
      const total = await adapter.count({
        model: 'roleResourceRelation',
        where
      })
      return json({
        records,
        total
      })
    }
  )
} satisfies BetterAuthPlugin['endpoints']
