import { and, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { country } from '@/db/schemas/common'
import { withOrderBy, withPagination } from '@/db/utils'
import { isEmpty } from '@/global/utils'
import type { ListReqType } from '../specs'

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
