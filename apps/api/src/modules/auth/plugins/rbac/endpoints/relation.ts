import type { Where } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import type { BetterAuthPlugin } from 'better-auth/plugins'
import { z } from 'zod'
import { buildTree, getChildrenNodes, getOpenAPISchema, isEmpty } from '@/global/utils'
import { basePath } from '../config'
import { relationListSpec } from '../services/relation'
import type { ResourceSpec } from '../services/resource'
import { resourceClientSpec } from '../services/resource'
import type { ResourceLocaleSpec } from '../services/resource-locale'
import { resourceLocaleClientSpec } from '../services/resource-locale'
import type { RoleSpec } from '../services/role'
import { roleClientSpec, roleListSpec } from '../services/role'
import type { RoleResourceRelationSpec } from '../services/role-resource-relation'
import type { UserSpec } from '../services/user'
import { getOneUserResourceTree } from '../services/user'
import type { UserRoleRelationSpec } from '../services/user-role-relation'
import { idSpec, pageSpec } from '../specs'

export const relationEndpoints = {
  listUserRoles: createAuthEndpoint(
    `${basePath}/list-user-roles`,
    {
      method: 'POST',
      body: z.object({
        ...relationListSpec.pick({ userId: true, roleName: true, sortBy: true }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List user roles',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({ userId: true, roleName: true, sortBy: true }).shape,
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
      const { userId, roleName, sortBy, page, pageSize } = body
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
        limit,
        sortBy
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
      body: z.object({
        ...relationListSpec.pick({
          userId: true,
          resourceName: true,
          resourceType: true,
          sortBy: true
        }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List user resources',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({
                      userId: true,
                      resourceName: true,
                      resourceType: true,
                      sortBy: true
                    }).shape,
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
                  schema: getOpenAPISchema(
                    z.object({
                      records: z.array(
                        z.object({
                          ...resourceClientSpec.shape,
                          ...idSpec.shape,
                          locales: z.array(resourceLocaleClientSpec)
                        })
                      ),
                      total: z.number()
                    })
                  )
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
      const { userId, resourceName, resourceType, sortBy, page, pageSize } = body
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
      const resourceRecords = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        offset,
        limit,
        sortBy
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
      body: relationListSpec.pick({ userId: true }),
      metadata: {
        openapi: {
          description: 'List user resource tree',
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
      const { userId } = body
      return json(getOneUserResourceTree(context, userId))
    }
  ),
  listUserRolesWithGrant: createAuthEndpoint(
    `${basePath}/list-user-roles-with-grant`,
    {
      method: 'POST',
      body: z.object({
        ...roleListSpec.shape,
        userId: z.string(),
        grant: z.boolean().nullish()
      }),
      metadata: {
        openapi: {
          description: 'List roles with grant',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...roleListSpec.shape,
                    userId: z.string(),
                    grant: z.boolean().nullish()
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
                  schema: getOpenAPISchema(
                    z.object({
                      records: z.array(
                        z.object({
                          ...roleClientSpec.shape,
                          ...idSpec.shape,
                          grant: z.boolean().nullish()
                        })
                      ),
                      total: z.number()
                    })
                  )
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
      const { name, enabled, sortBy, userId, grant, page, pageSize } = body
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
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [{ field: 'userId', value: userId }]
      })
      const roleRecords = await adapter.findMany<RoleSpec>({
        model: 'role',
        where,
        offset,
        limit,
        sortBy
      })
      const records = roleRecords
        .map(item => {
          return {
            ...item,
            grant: userRoleRelationRows.map(o => o.roleId).includes(item.id)
          }
        })
        .filter(item => {
          if (isEmpty(grant)) {
            return true
          }
          return item.grant === grant
        })
      const totalRecords = (
        await adapter.findMany<RoleSpec>({
          model: 'role',
          where
        })
      ).map(item => {
        return {
          ...item,
          grant: userRoleRelationRows.map(o => o.roleId).includes(item.id)
        }
      })
      const total = totalRecords.filter(item => {
        if (isEmpty(grant)) {
          return true
        }
        return item.grant === grant
      }).length
      return json({
        records,
        total
      })
    }
  ),
  listRoleUsers: createAuthEndpoint(
    `${basePath}/list-role-users`,
    {
      method: 'POST',
      body: z.object({
        ...relationListSpec.pick({ roleId: true, username: true, sortBy: true }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List role users',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({ roleId: true, username: true, sortBy: true }).shape,
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
      const { roleId, username, sortBy, page, pageSize } = body
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
  listRoleResources: createAuthEndpoint(
    `${basePath}/list-role-resources`,
    {
      method: 'POST',
      body: z.object({
        ...relationListSpec.pick({ roleId: true, resourceName: true, sortBy: true }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List role resources',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({ roleId: true, resourceName: true, sortBy: true })
                      .shape,
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
                  schema: getOpenAPISchema(
                    z.object({
                      records: z.array(
                        z.object({
                          ...resourceClientSpec.shape,
                          ...idSpec.shape,
                          locales: z.array(resourceLocaleClientSpec)
                        })
                      ),
                      total: z.number()
                    })
                  )
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
      const { roleId, resourceName, sortBy, page, pageSize } = body
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
      const resourceRecords = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        offset,
        limit,
        sortBy
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
      body: relationListSpec.pick({ roleId: true }),
      metadata: {
        openapi: {
          description: 'List role resource tree',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(relationListSpec.pick({ roleId: true }))
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
      const resourceRecords = await adapter.findMany<ResourceSpec>({
        model: 'resource',
        where,
        sortBy: {
          field: 'sort',
          direction: 'asc'
        }
      })
      const resourceList = resourceRecords.filter(o =>
        roleResourceRelationRows.map(item => item.resourceId).includes(o.id)
      )
      const disabledRecords: ResourceSpec[] = []

      for (const item of resourceList) {
        if (!item.enabled) {
          disabledRecords.push(item, ...getChildrenNodes(resourceRecords, item.id))
        }
      }

      const enabledResourceList = resourceList.filter(item => {
        return !disabledRecords.map(o => o.id).includes(item.id)
      })
      const resourceIds = enabledResourceList.map(o => o.id)
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
  listResourceRoles: createAuthEndpoint(
    `${basePath}/list-resource-roles`,
    {
      method: 'POST',
      body: z.object({
        ...relationListSpec.pick({ resourceId: true, roleName: true, sortBy: true }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List resource roles',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({ resourceId: true, roleName: true, sortBy: true })
                      .shape,
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
      const { resourceId, roleName, sortBy, page, pageSize } = body
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
        model: 'role',
        where,
        offset,
        limit,
        sortBy
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
  listResourceUsers: createAuthEndpoint(
    `${basePath}/list-resource-users`,
    {
      method: 'POST',
      body: z.object({
        ...relationListSpec.pick({ resourceId: true, username: true, sortBy: true }).shape,
        ...pageSpec.shape
      }),
      metadata: {
        openapi: {
          description: 'List resource users',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z.object({
                    ...relationListSpec.pick({ resourceId: true, username: true, sortBy: true })
                      .shape,
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
      const { resourceId, username, sortBy, page, pageSize } = body
      const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
        model: 'roleResourceRelation',
        where: [{ field: 'resourceId', value: resourceId }]
      })
      const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
        model: 'userRoleRelation',
        where: [
          { field: 'roleId', value: roleResourceRelationRows.map(o => o.roleId), operator: 'in' }
        ]
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
  listResourceTree: createAuthEndpoint(
    `${basePath}/list-resource-tree`,
    {
      method: 'POST',
      body: z
        .object({
          ...resourceClientSpec.pick({ enabled: true }).shape
        })
        .partial()
        .nullish(),
      metadata: {
        openapi: {
          description: 'List resource tree',
          requestBody: {
            content: {
              'application/json': {
                schema: getOpenAPISchema(
                  z
                    .object({
                      ...resourceClientSpec.pick({ enabled: true }).shape
                    })
                    .partial()
                    .nullish()
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
      const { json, context, body } = ctx
      const { adapter } = context
      const where: Where[] = []
      if (body && !isEmpty(body.enabled)) {
        where.push({
          field: 'enabled',
          value: body.enabled
        })
      }
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
} satisfies BetterAuthPlugin['endpoints']
