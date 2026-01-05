import { addSeconds } from 'date-fns'
import { and, eq, like } from 'drizzle-orm'
import { db } from '@/db'
import { adminSession } from '@/db/schemas/admin'
import { withOrderBy, withPagination } from '@/db/utils'
import { ADMIN_SESSION_MAX_AGE } from '@/global/config'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, GetReqType, ListReqType } from '../specs'

export const getSession = async (params: GetReqType) => {
  const { token } = params
  const row = (await db.select().from(adminSession).where(eq(adminSession.token, token)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return row
}

export const createSession = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(adminSession)
        .values({
          ...restParams,
          token: Bun.randomUUIDv7(),
          expiresAt: addSeconds(new Date(), ADMIN_SESSION_MAX_AGE).toISOString(),
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

export const deleteSession = async (params: DeleteReqType) => {
  const { token } = params
  const result = await db.delete(adminSession).where(eq(adminSession.token, token))
  return result
}

export const listSessions = async (params: ListReqType) => {
  const { username, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(adminSession).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminSession.username, `%${username}%`))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminSession[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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
