import { and, eq, inArray, like } from 'drizzle-orm'
import { db } from '@/db'
import { treasure } from '@/db/schemas/common'
import { withOrderBy, withPagination } from '@/db/utils'
import { throwDataNotFoundError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import type { GetReqType, ListReqType } from '../specs'

export const getTreasure = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(treasure).where(eq(treasure.id, id)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return row
}

export const listTreasures = async (params: ListReqType) => {
  const { id, title, fees, createdBy, categoryIds, countryCodes, status, page, pageSize, sortBy } =
    params

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
  if (countryCodes?.length) {
    where.push(inArray(treasure.countryCode, countryCodes))
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
