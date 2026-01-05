import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { adminRoleResourceRelation } from '@/db/schemas/admin'
import { withPagination } from '@/db/utils'
import { throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, ListReqType, SetManyReqType } from '../specs'

export const createRoleResourceRelation = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(adminRoleResourceRelation)
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

export const setManyRoleResourceRelations = async (
  params: SetManyReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, roleId, createResourceIds, deleteResourceIds } = params
  try {
    if (createResourceIds.length > 0) {
      const insertValues = createResourceIds.map(val => {
        return {
          roleId,
          resourceId: val,
          createdBy: createdByUsername,
          updatedBy: createdByUsername
        }
      })
      await db.insert(adminRoleResourceRelation).values(insertValues).returning()
    }
    if (deleteResourceIds.length > 0) {
      await db
        .delete(adminRoleResourceRelation)
        .where(
          and(
            eq(adminRoleResourceRelation.roleId, roleId),
            inArray(adminRoleResourceRelation.resourceId, deleteResourceIds)
          )
        )
    }
    return {}
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteRoleResourceRelation = async (params: DeleteReqType) => {
  const { roleId, resourceId } = params
  const result = await db
    .delete(adminRoleResourceRelation)
    .where(
      and(
        eq(adminRoleResourceRelation.roleId, roleId),
        eq(adminRoleResourceRelation.resourceId, resourceId)
      )
    )
  return result
}

export const listRoleResourceRelations = async (params: ListReqType) => {
  const { roleId, resourceId, roleIds, resourceIds, page, pageSize } = params
  if ([roleId, resourceId, roleIds, resourceIds].filter(v => !isEmpty(v)).length === 0) {
    return {
      total: 0,
      records: []
    }
  }
  const where = []
  const dynamicQuery = db.select().from(adminRoleResourceRelation).$dynamic()

  if (!isEmpty(roleId)) {
    where.push(eq(adminRoleResourceRelation.roleId, roleId))
  }
  if (!isEmpty(roleIds)) {
    where.push(inArray(adminRoleResourceRelation.roleId, roleIds))
  }
  if (!isEmpty(resourceId)) {
    where.push(eq(adminRoleResourceRelation.resourceId, resourceId))
  }
  if (!isEmpty(resourceIds)) {
    where.push(inArray(adminRoleResourceRelation.resourceId, resourceIds))
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
