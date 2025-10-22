import { generateId } from 'better-auth'
import { and, eq, inArray, like } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { thing } from '@/db/schemas/content'
import { withOrderBy, withPagination } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { convertDateValues, isEmpty } from '@/global/utils'
import type { insertReqSchema, rowResSchema, searchReqSchema, updateReqSchema } from '../schemas'
import { statusSpec } from '../schemas'

export const getOneThing = async (params: z.infer<typeof updateReqSchema>) => {
  const { id } = params
  const row = (await db.select().from(thing).where(eq(thing.id, id)))[0]
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}

export const createThing = async (
  params: z.infer<typeof insertReqSchema> & {
    userId: string
    username: string
  }
) => {
  const { Draft } = statusSpec.status.enum
  const { username, ...restParams } = params
  try {
    const result = (
      await db
        .insert(thing)
        .values({
          ...restParams,
          id: generateId(),
          status: Draft,
          createdBy: username,
          updatedBy: username
        })
        .returning()
    )[0]
    return convertDateValues(result) as z.infer<typeof rowResSchema>
  } catch (err) {
    return throwDbError(err)
  }
}

export const updateThing = async (
  params: z.infer<typeof updateReqSchema> & {
    username: string
  }
) => {
  const { id, username, ...restParams } = params
  try {
    const result = (
      await db
        .update(thing)
        .set({
          ...restParams,
          updatedBy: username,
          updatedAt: new Date()
        })
        .where(eq(thing.id, id))
        .returning()
    )[0]
    return convertDateValues(result) as z.infer<typeof rowResSchema>
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteThing = async (params: { id: string }) => {
  const { id } = params
  const row = (await db.delete(thing).where(eq(thing.id, id)).returning())[0]
  return row
}

export const listThing = async (params: z.infer<typeof searchReqSchema>) => {
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
  withOrderBy(dynamicQuery, thing[sortBy.field], sortBy.direction)

  const total = (await dynamicQuery).length

  if (!isEmpty(page) && !isEmpty(pageSize)) {
    withPagination(dynamicQuery, page, pageSize)
  }
  const records = (await dynamicQuery).map(convertDateValues) as z.infer<typeof rowResSchema>[]
  return {
    total,
    records
  }
}
