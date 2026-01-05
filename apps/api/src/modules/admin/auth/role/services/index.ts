import { and, eq, inArray, like } from 'drizzle-orm'
import { db } from '@/db'
import { adminRole } from '@/db/schemas/admin'
import { withOrderBy, withPagination } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import { listRoleResourceRelations } from '@/modules/admin/auth/role-resource-relation/services'
import { listUserRoleRelations } from '@/modules/admin/auth/user-role-relation/services'
import type {
  CreateReqType,
  DeleteReqType,
  GetReqType,
  ListReqType,
  ListResourceRolesReqType,
  ListUserGrantRolesReqType,
  ListUserRolesReqType,
  UpdateReqType
} from '../specs'

export const getRole = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(adminRole).where(eq(adminRole.id, id)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return row
}

export const createRole = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(adminRole)
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

export const updateRole = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, ...restParams } = params
  await getRole({ id })
  try {
    const row = (
      await db
        .update(adminRole)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(adminRole.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteRole = async (params: DeleteReqType) => {
  const { id } = params
  const result = await db.delete(adminRole).where(eq(adminRole.id, id))
  return result
}

export const listRoles = async (params: ListReqType) => {
  const { name, enabled, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(adminRole).$dynamic()

  if (!isEmpty(name)) {
    where.push(like(adminRole.name, `%${name}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminRole.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminRole[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

  const total = (await dynamicQuery).length

  if (!isEmpty(page) && !isEmpty(pageSize)) {
    withPagination(dynamicQuery, page, pageSize)
  }
  const records = await dynamicQuery

  return {
    total,
    records
  }
}

export const listUserRoles = async (params: ListUserRolesReqType) => {
  const { userId, name, enabled, page, pageSize, sortBy } = params

  const roleIds = (await listUserRoleRelations({ userId })).records.map(o => o.roleId)

  const where = [inArray(adminRole.id, roleIds)]
  const dynamicQuery = db.select().from(adminRole).$dynamic()

  if (!isEmpty(name)) {
    where.push(like(adminRole.name, `%${name}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminRole.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminRole[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

  const total = (await dynamicQuery).length

  if (!isEmpty(page) && !isEmpty(pageSize)) {
    withPagination(dynamicQuery, page, pageSize)
  }

  const records = await dynamicQuery

  return {
    total,
    records
  }
}

export const listUserGrantRoles = async (params: ListUserGrantRolesReqType) => {
  const { userId, name, enabled, grant, page, pageSize, sortBy } = params

  const roleIds = (await listUserRoleRelations({ userId })).records.map(o => o.roleId)

  const where = []
  const dynamicQuery = db.select().from(adminRole).$dynamic()

  if (!isEmpty(name)) {
    where.push(like(adminRole.name, `%${name}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminRole.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminRole[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

  const allRecords = (await dynamicQuery)
    .map(item => {
      return {
        ...item,
        grant: roleIds.includes(item.id)
      }
    })
    .filter(item => {
      if (isEmpty(grant)) {
        return true
      }
      return item.grant === grant
    })

  const total = allRecords.length

  if (!isEmpty(page) && !isEmpty(pageSize)) {
    withPagination(dynamicQuery, page, pageSize)
  }

  const records = (await dynamicQuery)
    .map(item => {
      return {
        ...item,
        grant: roleIds.includes(item.id)
      }
    })
    .filter(item => {
      if (isEmpty(grant)) {
        return true
      }
      return item.grant === grant
    })

  return {
    total,
    records
  }
}

export const listResourceRoles = async (params: ListResourceRolesReqType) => {
  const { resourceId, name, enabled, page, pageSize, sortBy } = params

  const roleIds = (await listRoleResourceRelations({ resourceId })).records.map(o => o.roleId)

  const where = [inArray(adminRole.id, roleIds)]
  const dynamicQuery = db.select().from(adminRole).$dynamic()

  if (!isEmpty(name)) {
    where.push(like(adminRole.name, `%${name}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminRole.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminRole[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

  const total = (await dynamicQuery).length

  if (!isEmpty(page) && !isEmpty(pageSize)) {
    withPagination(dynamicQuery, page, pageSize)
  }

  const records = await dynamicQuery

  return {
    total,
    records
  }
}
