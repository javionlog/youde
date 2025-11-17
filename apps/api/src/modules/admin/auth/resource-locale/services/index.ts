import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { adminResourceLocale } from '@/db/schemas/admin'
import { throwDbError } from '@/global/errors'
import type { CreateReqType, GetReqType, UpdateReqType } from '../specs'

export const getAdminResourceLocale = async (params: GetReqType) => {
  const { id } = params

  const row = (await db.select().from(adminResourceLocale).where(eq(adminResourceLocale.id, id)))[0]

  return row
}

export const createAdminResourceLocale = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(adminResourceLocale)
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

export const updateAdminResourceLocale = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, ...restParams } = params
  await getAdminResourceLocale({ id })
  try {
    const row = (
      await db
        .update(adminResourceLocale)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(adminResourceLocale.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}
