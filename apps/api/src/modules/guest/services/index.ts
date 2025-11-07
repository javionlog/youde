import { and, eq, inArray, like } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { thing } from '@/db/schemas/thing'
import { withOrderBy, withPagination } from '@/db/utils'
import { isEmpty } from '@/global/utils'
import type { promiseListResSpec, searchReqSpec } from '../specs'

export const listThings = async (params: z.infer<typeof searchReqSpec>) => {
  const { id, categoryIds, title, userId, status, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(thing).$dynamic()

  if (!isEmpty(id)) {
    where.push(eq(thing.id, id))
  }
  if (!isEmpty(id)) {
    where.push(eq(thing.id, id))
  }
  if (categoryIds?.length) {
    where.push(inArray(thing.categoryId, categoryIds))
  }
  if (!isEmpty(title)) {
    where.push(like(thing.title, `%${title}%`))
  }
  if (!isEmpty(userId)) {
    where.push(eq(thing.userId, userId))
  }
  if (status?.length) {
    where.push(inArray(thing.status, status))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, thing[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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
