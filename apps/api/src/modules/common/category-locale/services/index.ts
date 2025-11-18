import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { categoryLocale } from '@/db/schemas/common'
import { throwDbError } from '@/global/errors'
import type { CreateReqType, GetReqType, UpdateReqType } from '../specs'

export const getCategoryLocale = async (params: GetReqType) => {
  const { id } = params

  const row = (await db.select().from(categoryLocale).where(eq(categoryLocale.id, id)))[0]

  return row
}

export const createCategoryLocale = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(categoryLocale)
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

export const updateCategoryLocale = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, ...restParams } = params
  await getCategoryLocale({ id })
  try {
    const row = (
      await db
        .update(categoryLocale)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(categoryLocale.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}
