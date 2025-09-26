import type { AuthContext, Where } from 'better-auth'
import { uniqBy } from 'es-toolkit'
import { z } from 'zod'
import { buildTree, getChildrenNodes, getParentNodes } from '@/global/utils'
import { throwDataDuplicationError, throwDataNotFoundError } from '../errors'
import type { ResourceSpec } from '../services/resource'
import type { ResourceLocaleSpec } from '../services/resource-locale'
import type { RoleSpec } from '../services/role'
import type { RoleResourceRelationSpec } from '../services/role-resource-relation'
import type { UserRoleRelationSpec } from '../services/user-role-relation'
import { pageSpec, sortBySpec } from '../specs'

export const userSpec = z.object({
  name: z.string(),
  username: z.string(),
  displayUsername: z.string().nullish(),
  email: z.string(),
  password: z.string()
})

export const userListSpec = z.object({
  ...pageSpec.shape,
  ...sortBySpec.shape,
  username: z.string().nullish(),
  displayUsername: z.string().nullish(),
  email: z.string().nullish()
})

export type UserSpec = z.infer<typeof userSpec> & { id: string }

export const getOneUser = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<UserSpec>({
    model: 'user',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}

export const getOneUserResourceTree = async (ctx: AuthContext, userId: string) => {
  const { adapter } = ctx
  const userRoleRelationRows = await adapter.findMany<UserRoleRelationSpec>({
    model: 'userRoleRelation',
    where: [{ field: 'userId', value: userId }]
  })
  const roleRows = await adapter.findMany<RoleSpec>({
    model: 'role',
    where: [{ field: 'id', value: userRoleRelationRows.map(o => o.roleId), operator: 'in' }]
  })
  const roleResourceRelationRows = await adapter.findMany<RoleResourceRelationSpec>({
    model: 'roleResourceRelation',
    where: [
      { field: 'roleId', value: roleRows.filter(o => o.enabled).map(o => o.id), operator: 'in' }
    ]
  })
  const where: Where[] = []
  const resourceRecords = await adapter.findMany<ResourceSpec>({
    model: 'resource',
    where,
    sortBy: {
      field: 'sort',
      direction: 'asc'
    }
  })
  const leafRecords = resourceRecords.filter(o =>
    roleResourceRelationRows.map(item => item.resourceId).includes(o.id)
  )
  const parentRecords: ResourceSpec[] = []
  const disabledRecords: ResourceSpec[] = []
  for (const item of roleResourceRelationRows) {
    const parentNodes = getParentNodes(resourceRecords, item.resourceId) ?? []
    parentRecords.push(...parentNodes)
  }

  const resourceList = uniqBy([...leafRecords, ...parentRecords], item => item.id)
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
  const records = enabledResourceList.map(item => {
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
  return tree
}

export const checkUsername = async (ctx: AuthContext, username: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<UserSpec>({
    model: 'user',
    where: [{ field: 'username', value: username }]
  })
  if (row) {
    return throwDataDuplicationError('Username duplication')
  }
  return row
}

export const checkEmail = async (ctx: AuthContext, email: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<UserSpec>({
    model: 'user',
    where: [{ field: 'email', value: email }]
  })
  if (row) {
    return throwDataDuplicationError('E-mail duplication')
  }
  return row
}
