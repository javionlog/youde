import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { adminUserRoleRelation } from '@/db/schemas/admin'
import { withPagination } from '@/db/utils'
import { throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, ListReqType } from '../specs'

export const createUserRoleRelation = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(adminUserRoleRelation)
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

export const deleteUserRoleRelation = async (params: DeleteReqType) => {
  const { userId, roleId } = params
  const result = await db
    .delete(adminUserRoleRelation)
    .where(and(eq(adminUserRoleRelation.userId, userId), eq(adminUserRoleRelation.roleId, roleId)))
  return result
}

export const listUserRoleRelations = async (params: ListReqType) => {
  const { userId, roleId, userIds, roleIds, page, pageSize } = params

  if ([userId, roleId, userIds, roleIds].filter(v => !isEmpty(v)).length === 0) {
    return {
      total: 0,
      records: []
    }
  }
  const where = []
  const dynamicQuery = db.select().from(adminUserRoleRelation).$dynamic()

  if (!isEmpty(userId)) {
    where.push(eq(adminUserRoleRelation.userId, userId))
  }
  if (!isEmpty(userIds)) {
    where.push(inArray(adminUserRoleRelation.userId, userIds))
  }
  if (!isEmpty(roleId)) {
    where.push(eq(adminUserRoleRelation.roleId, roleId))
  }
  if (!isEmpty(roleIds)) {
    where.push(inArray(adminUserRoleRelation.roleId, roleIds))
  }
  dynamicQuery.where(and(...where))

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
