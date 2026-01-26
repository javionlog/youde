import { and, eq, inArray, like } from 'drizzle-orm'
import { db } from '@/db'
import { treasure } from '@/db/schemas/common'
import { withOrderBy, withPagination } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, GetReqType, ListReqType, UpdateReqType } from '../specs'

export const getTreasure = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(treasure).where(eq(treasure.id, id)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return row
}

export const createTreasure = async (
  params: CreateReqType & {
    userId: string
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(treasure)
        .values({
          ...restParams,
          status: 'Draft',
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

export const updateTreasure = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, ...restParams } = params
  await getTreasure({ id })
  try {
    const row = (
      await db
        .update(treasure)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toISOString()
        })
        .where(eq(treasure.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteTreasure = async (params: DeleteReqType) => {
  const { id } = params
  const result = await db.delete(treasure).where(eq(treasure.id, id))
  return result
}

export const listTreasures = async (params: ListReqType) => {
  const { id, title, fees, createdBy, categoryIds, status, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(treasure).$dynamic()

  if (!isEmpty(id)) {
    where.push(eq(treasure.id, id))
  }
  if (!isEmpty(title)) {
    where.push(like(treasure.title, `%${title}%`))
  }
  if (!isEmpty(createdBy)) {
    where.push(eq(treasure.createdBy, createdBy))
  }
  if (fees?.length) {
    where.push(inArray(treasure.fee, fees))
  }
  if (categoryIds?.length) {
    where.push(inArray(treasure.categoryId, categoryIds))
  }
  if (status?.length) {
    where.push(inArray(treasure.status, status))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, treasure[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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
