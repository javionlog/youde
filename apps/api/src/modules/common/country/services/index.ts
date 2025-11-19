import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { country } from '@/db/schemas/common'
import { withOrderBy, withPagination } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, GetReqType, ListReqType, UpdateReqType } from '../specs'

export const getCountry = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(country).where(eq(country.id, id)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return row
}

export const createCountry = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(country)
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

export const updateCountry = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, ...restParams } = params
  await getCountry({ id })
  try {
    const row = (
      await db
        .update(country)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(country.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteCountry = async (params: DeleteReqType) => {
  const { id } = params
  const result = await db.delete(country).where(eq(country.id, id))
  return result
}

export const listCountries = async (params: ListReqType) => {
  const { regions, codes, enUs, zhCn, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(country).$dynamic()

  if (regions?.length) {
    where.push(inArray(country.region, regions))
  }
  if (codes?.length) {
    where.push(inArray(country.code, codes))
  }
  if (enUs?.length) {
    where.push(inArray(country.enUs, enUs))
  }
  if (zhCn?.length) {
    where.push(inArray(country.zhCn, zhCn))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, country[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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
