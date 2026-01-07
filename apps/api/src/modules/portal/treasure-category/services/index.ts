import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { treasureCategory, treasureCategoryLocale } from '@/db/schemas/common'
import { withOrderBy } from '@/db/utils'
import { buildTree, isEmpty } from '@/global/utils'
import type { ListReqType } from '../specs'

export const listTreasureCategoryTree = async (params: ListReqType) => {
  const { enabled } = params

  const dynamicQuery = db.select().from(treasureCategory).$dynamic()
  const where = []

  if (!isEmpty(enabled)) {
    where.push(eq(treasureCategory.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, treasureCategory.sort, 'asc')

  const records = await dynamicQuery

  const locales = await db
    .select()
    .from(treasureCategoryLocale)
    .where(
      inArray(
        treasureCategoryLocale.categoryId,
        records.map(o => o.id)
      )
    )

  const result = records.map(item => {
    return {
      ...item,
      locales: locales.filter(localeItem => {
        return item.id === localeItem.categoryId
      })
    }
  })

  return buildTree(result)
}
