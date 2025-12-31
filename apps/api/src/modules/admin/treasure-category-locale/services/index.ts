import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { treasureCategoryLocale } from '@/db/schemas/common'
import { throwDbError } from '@/global/errors'
import type { CreateReqType, GetReqType, UpdateReqType } from '../specs'

export const getTreasureCategoryLocale = async (params: GetReqType) => {
  const { id } = params

  const row = (
    await db.select().from(treasureCategoryLocale).where(eq(treasureCategoryLocale.id, id))
  )[0]

  return row
}

export const createTreasureCategoryLocale = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(treasureCategoryLocale)
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

export const updateTreasureCategoryLocale = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, ...restParams } = params
  await getTreasureCategoryLocale({ id })
  try {
    const row = (
      await db
        .update(treasureCategoryLocale)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(treasureCategoryLocale.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}
