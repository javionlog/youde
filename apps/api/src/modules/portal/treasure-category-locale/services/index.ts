import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { treasureCategoryLocale } from '@/db/schemas/common'
import type { GetReqType } from '../specs'

export const getTreasureCategoryLocale = async (params: GetReqType) => {
  const { id } = params

  const row = (
    await db.select().from(treasureCategoryLocale).where(eq(treasureCategoryLocale.id, id))
  )[0]

  return row
}
