import type { User, Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { basePath } from '../config'
import { pageSpec } from '../schemas/base'
import { resourceSchema } from '../schemas/resource'
import { roleSchema } from '../schemas/role'
import { roleResourceRelationSchema } from '../schemas/role-resource-relation'
import { userRoleRelationSchema } from '../schemas/user-role-relation'
import { buildTree, getOpenAPISchema, getZodSchema, isEmpty } from '../utils'

const roleSpec = getZodSchema({ fields: roleSchema.role.fields, isClientSide: false })

const resourceSpec = getZodSchema({ fields: resourceSchema.resource.fields, isClientSide: false })

const userRoleRelationSpec = getZodSchema({
  fields: userRoleRelationSchema.userRoleRelation.fields,
  isClientSide: false
})

const userRoleRelationListSpec = z.object({
  ...pageSpec.shape,
  ...userRoleRelationSpec.shape,
  roleName: z.string().nullish(),
  username: z.string().nullish()
})

const roleResourceRelationSpec = getZodSchema({
  fields: roleResourceRelationSchema.roleResourceRelation.fields,
  isClientSide: false
})

const roleResourceRelationListSpec = z.object({
  ...pageSpec.shape,
  ...roleResourceRelationSpec.shape,
  roleName: z.string().nullish(),
  resourceName: z.string().nullish()
})

const userResourceRelationListSpec = z.object({
  ...pageSpec.shape,
  ...userRoleRelationSpec.pick({ userId: true }).shape,
  ...roleResourceRelationSpec.pick({ resourceId: true }).shape,
  username: z.string().nullish(),
  resourceName: z.string().nullish(),
  resourceType: z.enum(['Menu', 'Page', 'Element']).nullish()
})

type UserSpec = User & { username?: string }
type RoleSpec = z.infer<typeof roleSpec>
type ResourceSpec = z.infer<typeof resourceSpec>
type UserRoleRelationSpec = z.infer<typeof userRoleRelationSpec>
type RoleResourceRelationSpec = z.infer<typeof roleResourceRelationSpec>

export const relationEndpoints = {
  listUserRoles: createAuthEndpoint(
    `${basePath}/list-user-roles`,
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
  listUserResources: createAuthEndpoint(
    `${basePath}/list-user-resources`,
    {
      method: 'POST',
      body: userResourceRelationListSpec.omit({ resourceId: true, username: true }),
      metadata: {
        openapi: {
          description: 'List user resources',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  userResourceRelationListSpec.omit({ resourceId: true, username: true })
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
                    items: {
                      $ref: '#/components/schemas/Resource'
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
      const { userId, resourceName, resourceType, page, pageSize } = body
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'userId', value: userId }]
      })
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'roleId', value: userRoleRelationRows.map(o => o.roleId), operator: 'in' }]
      })
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = [
        { field: 'id', value: roleResourceRelationRows.map(row => row.resourceId), operator: 'in' }
      ]
      if (!isEmpty(resourceName)) {
        where.push({
          field: 'name',
          value: resourceName,
          operator: 'contains'
        })
      }
      if (!isEmpty(resourceType)) {
        where.push({
          field: 'type',
          value: resourceType
        })
      }
      const records = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        offset,
        limit
      })
      const total = await adapter.count({
        model: 'resource',
        where
      })
      return json({
        records,
        total
      })
    }
  ),
  listUserResourceTree: createAuthEndpoint(
    `${basePath}/list-user-resource-tree`,
    {
      method: 'POST',
      body: userResourceRelationListSpec.pick({ userId: true }),
      metadata: {
        openapi: {
          description: 'List user resource tree',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(userResourceRelationListSpec.pick({ userId: true }))
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
      const { body, json, context } = ctx
      const { adapter } = context
      const { userId } = body
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'userId', value: userId }]
      })
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'roleId', value: userRoleRelationRows.map(o => o.roleId), operator: 'in' }]
      })
      const where: Where[] = [
        { field: 'id', value: roleResourceRelationRows.map(row => row.resourceId), operator: 'in' }
      ]
      const records = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        sortBy: {
          field: 'sort',
          direction: 'asc'
        }
      })
      const tree = buildTree(records)
      return json(tree)
    }
  ),
  listRoleUsers: createAuthEndpoint(
    `${basePath}/list-role-users`,
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
  ),
  listRoleResources: createAuthEndpoint(
    `${basePath}/list-role-resources`,
    {
      method: 'POST',
      body: roleResourceRelationListSpec.omit({ resourceId: true, roleName: true }),
      metadata: {
        openapi: {
          description: 'List role resources',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  roleResourceRelationListSpec.omit({ resourceId: true, roleName: true })
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
                    items: {
                      $ref: '#/components/schemas/Resource'
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
      const { roleId, resourceName, page, pageSize } = body
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'roleId', value: roleId }]
      })
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = [
        { field: 'id', value: roleResourceRelationRows.map(row => row.resourceId), operator: 'in' }
      ]
      if (!isEmpty(resourceName)) {
        where.push({
          field: 'name',
          value: resourceName,
          operator: 'contains'
        })
      }
      const records = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        offset,
        limit
      })
      const total = await adapter.count({
        model: 'resource',
        where
      })
      return json({
        records,
        total
      })
    }
  ),
  listRoleResourceTree: createAuthEndpoint(
    `${basePath}/list-role-resource-tree`,
    {
      method: 'POST',
      body: roleResourceRelationListSpec.pick({ roleId: true }),
      metadata: {
        openapi: {
          description: 'List role resource tree',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(roleResourceRelationListSpec.pick({ roleId: true }))
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
      const { body, json, context } = ctx
      const { adapter } = context
      const { roleId } = body
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'roleId', value: roleId }]
      })
      const where: Where[] = [
        { field: 'id', value: roleResourceRelationRows.map(row => row.resourceId), operator: 'in' }
      ]
      const records = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        sortBy: {
          field: 'sort',
          direction: 'asc'
        }
      })
      const tree = buildTree(records)
      return json(tree)
    }
  ),
  listResourceRoles: createAuthEndpoint(
    `${basePath}/list-resource-roles`,
    {
      method: 'POST',
      body: roleResourceRelationListSpec.omit({ roleId: true, resourceName: true }),
      metadata: {
        openapi: {
          description: 'List resource roles',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  roleResourceRelationListSpec.omit({ roleId: true, resourceName: true })
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
      const { resourceId, roleName, page, pageSize } = body
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'resourceId', value: resourceId }]
      })
      let offset: number | undefined
      let limit: number | undefined
      if (!isEmpty(page) && !isEmpty(pageSize)) {
        offset = (page - 1) * pageSize
        limit = pageSize
      }
      const where: Where[] = [
        { field: 'id', value: roleResourceRelationRows.map(row => row.roleId), operator: 'in' }
      ]
      if (!isEmpty(roleName)) {
        where.push({
          field: 'name',
          value: roleName,
          operator: 'contains'
        })
      }
      const records = await adapter.findMany<ResourceSpec>({
        model: 'resource',
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
