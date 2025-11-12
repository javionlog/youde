import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { adminResource, adminResourceLocale, adminRole } from '@/db/schemas/admin'
import { withOrderBy } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { buildTree, getChildrenNodes, isEmpty } from '@/global/utils'
import { listAdminRoleResourceRelations } from '@/modules/admin/auth/role-resource-relation/services'
import { listAdminUserRoleRelations } from '@/modules/admin/auth/user-role-relation/services'
import type {
  CreateReqType,
  DeleteReqType,
  GetReqType,
  ListReqType,
  ListRoleResourcesReqType,
  ListUserResourcesReqType,
  RowType,
  UpdateReqType
} from '../specs'

export const getAdminResource = async (params: GetReqType) => {
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

export const createAdminResource = async (
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

export const updateAdminResource = async (
  params: UpdateReqType & {
    createdByUsername: string
  }
) => {
  const { id, parentId: _parentId, createdByUsername, ...restParams } = params
  await getAdminResource({ id })
  try {
    const row = (
      await db
        .update(adminResource)
        .set({
          ...restParams,
          updatedBy: createdByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(adminResource.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteAdminResource = async (params: DeleteReqType) => {
  const { id } = params
  const result = await db.delete(adminResource).where(eq(adminResource.id, id))
  return result
}

export const listAdminResourceTree = async (params: ListReqType) => {
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

export const listUserAdminResourceTree = async (params: ListUserResourcesReqType) => {
  const { userId } = params
  const roleIds = (await listAdminUserRoleRelations({ userId })).records.map(o => o.roleId)
  const roleRecords = await db.select().from(adminRole).where(inArray(adminRole.id, roleIds))
  const resourceIds = (
    await listAdminRoleResourceRelations({
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

export const listRoleAdminResourceTree = async (params: ListRoleResourcesReqType) => {
  const { roleId } = params
  const resourceIds = (
    await listAdminRoleResourceRelations({
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
