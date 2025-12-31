import { and, eq, inArray, like } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { treasure } from '@/db/schemas/common'
import { withOrderBy, withPagination } from '@/db/utils'
import { isEmpty } from '@/global/utils'
import type { listReqSpec, promiseListResSpec } from '../specs'

export const listTreasures = async (params: z.infer<typeof listReqSpec>) => {
  const { id, categoryIds, title, userId, status, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(treasure).$dynamic()

  if (!isEmpty(id)) {
    where.push(eq(treasure.id, id))
  }
  if (!isEmpty(id)) {
    where.push(eq(treasure.id, id))
  }
  if (categoryIds?.length) {
    where.push(inArray(treasure.categoryId, categoryIds))
  }
  if (!isEmpty(title)) {
    where.push(like(treasure.title, `%${title}%`))
  }
  if (!isEmpty(userId)) {
    where.push(eq(treasure.userId, userId))
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
  } as z.infer<typeof promiseListResSpec>
}
