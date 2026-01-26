import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { adminResource, adminResourceLocale, adminRole } from '@/db/schemas/admin'
import { withOrderBy } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { buildTree, getChildrenNodes, isEmpty } from '@/global/utils'
import { listRoleResourceRelations } from '@/modules/admin/auth/role-resource-relation/services'
import { listUserRoleRelations } from '@/modules/admin/auth/user-role-relation/services'
import { getUser } from '@/modules/admin/user/services'
import type {
  CreateReqType,
  DeleteReqType,
  GetReqType,
  ListReqType,
  ListRoleGrantResourcesReqType,
  ListRoleResourcesReqType,
  ListUserResourcesReqType,
  RowType,
  UpdateReqType
} from '../specs'

export const getResource = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(adminResource).where(eq(adminResource.id, id)))[0]
  const locales = await db
    .select()
    .from(adminResourceLocale)
    .where(eq(adminResourceLocale.resourceId, id))

  if (!row) {
    throwDataNotFoundError()
  }

  const result = { ...row, locales }

  return result
}

export const createResource = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(adminResource)
        .values({
          ...restParams,
          createdBy: createdByUsername,
          updatedBy: createdByUsername
        })
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const updateResource = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, parentId: _parentId, updatedByUsername, ...restParams } = params
  await getResource({ id })
  try {
    const row = (
      await db
        .update(adminResource)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toISOString()
        })
        .where(eq(adminResource.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteResource = async (params: DeleteReqType) => {
  const { id } = params
  const result = await db.delete(adminResource).where(eq(adminResource.id, id))
  return result
}

export const listResourceTree = async (params: ListReqType) => {
  const { enabled } = params

  const where = []
  const dynamicQuery = db.select().from(adminResource).$dynamic()

  if (!isEmpty(enabled)) {
    where.push(eq(adminResource.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminResource.sort, 'asc')

  const records = await dynamicQuery
  const locales = await db
    .select()
    .from(adminResourceLocale)
    .where(
      inArray(
        adminResourceLocale.resourceId,
        records.map(o => o.id)
      )
    )

  const result = records.map(item => {
    return {
      ...item,
      locales: locales.filter(localeItem => {
        return item.id === localeItem.resourceId
      })
    }
  })

  return buildTree(result)
}

export const listUserResourceTree = async (params: ListUserResourcesReqType) => {
  const { userId } = params
  const userRow = await getUser({ id: userId })

  if (userRow.isAdmin) {
    return await listResourceTree({})
  }

  const roleIds = (await listUserRoleRelations({ userId })).records.map(o => o.roleId)
  const roleRecords = await db.select().from(adminRole).where(inArray(adminRole.id, roleIds))
  const resourceIds = (
    await listRoleResourceRelations({
      roleIds: roleRecords.filter(o => o.enabled).map(o => o.id)
    })
  ).records.map(o => o.resourceId)

  const dynamicQuery = db.select().from(adminResource).$dynamic()
  withOrderBy(dynamicQuery, adminResource.sort, 'asc')
  const resourceRecords = await dynamicQuery
  const resourceList = resourceRecords.filter(o => resourceIds.includes(o.id))
  const disabledResourceList: RowType[] = []
  for (const item of resourceList) {
    if (!item.enabled) {
      disabledResourceList.push(item, ...getChildrenNodes(resourceRecords, item.id))
    }
  }
  const enabledResourceList = resourceList.filter(item => {
    return !disabledResourceList.map(o => o.id).includes(item.id)
  })

  const locales = await db
    .select()
    .from(adminResourceLocale)
    .where(
      inArray(
        adminResourceLocale.resourceId,
        enabledResourceList.map(o => o.id)
      )
    )

  const result = enabledResourceList.map(item => {
    return {
      ...item,
      locales: locales.filter(localeItem => {
        return item.id === localeItem.resourceId
      })
    }
  })

  return buildTree(result)
}

export const listRoleResourceTree = async (params: ListRoleResourcesReqType) => {
  const { roleId } = params
  const resourceIds = (
    await listRoleResourceRelations({
      roleId
    })
  ).records.map(o => o.resourceId)

  const dynamicQuery = db.select().from(adminResource).$dynamic()
  withOrderBy(dynamicQuery, adminResource.sort, 'asc')
  const resourceRecords = await dynamicQuery
  const resourceList = resourceRecords.filter(o => resourceIds.includes(o.id))
  const disabledResourceList: RowType[] = []
  for (const item of resourceList) {
    if (!item.enabled) {
      disabledResourceList.push(item, ...getChildrenNodes(resourceRecords, item.id))
    }
  }
  const enabledResourceList = resourceList.filter(item => {
    return !disabledResourceList.map(o => o.id).includes(item.id)
  })

  const locales = await db
    .select()
    .from(adminResourceLocale)
    .where(
      inArray(
        adminResourceLocale.resourceId,
        enabledResourceList.map(o => o.id)
      )
    )

  const result = enabledResourceList.map(item => {
    return {
      ...item,
      locales: locales.filter(localeItem => {
        return item.id === localeItem.resourceId
      })
    }
  })

  return buildTree(result)
}

export const listRoleGrantResourceTree = async (params: ListRoleGrantResourcesReqType) => {
  const { roleId } = params
  const resourceIds = (
    await listRoleResourceRelations({
      roleId
    })
  ).records.map(o => o.resourceId)

  const dynamicQuery = db.select().from(adminResource).$dynamic()
  withOrderBy(dynamicQuery, adminResource.sort, 'asc')
  const resourceRecords = await dynamicQuery
  const resourceList = resourceRecords.filter(o => resourceIds.includes(o.id))
  const disabledResourceList: RowType[] = []
  for (const item of resourceList) {
    if (!item.enabled) {
      disabledResourceList.push(item, ...getChildrenNodes(resourceRecords, item.id))
    }
  }

  const allEnabledResourceList = resourceRecords
    .filter(item => {
      return !disabledResourceList.map(o => o.id).includes(item.id)
    })
    .map(item => {
      return {
        ...item,
        grant: resourceIds.includes(item.id)
      }
    })

  const locales = await db
    .select()
    .from(adminResourceLocale)
    .where(
      inArray(
        adminResourceLocale.resourceId,
        allEnabledResourceList.map(o => o.id)
      )
    )

  const result = allEnabledResourceList.map(item => {
    return {
      ...item,
      locales: locales.filter(localeItem => {
        return item.id === localeItem.resourceId
      })
    }
  })

  return buildTree(result)
}
