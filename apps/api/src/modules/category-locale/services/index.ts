import { generateId } from 'better-auth'
import { and, eq } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { categoryLocale } from '@/db/schemas/thing'
import { throwDbError } from '@/global/errors'
import type { getReqSpec, insertReqSpec, updateReqSpec } from '../specs'

export const getCategoryLocale = async (params: z.infer<typeof getReqSpec>) => {
  const { categoryId, field } = params

  const row = (
    await db
      .select()
      .from(categoryLocale)
      .where(and(eq(categoryLocale.categoryId, categoryId), eq(categoryLocale.field, field)))
  )[0]

  return row
}

export const createCategoryLocale = async (
  params: z.infer<typeof insertReqSpec> & {
    userId: string
    username: string
  }
) => {
  const { username, ...restParams } = params
  try {
    const row = (
      await db
        .insert(categoryLocale)
        .values({
          ...restParams,
          id: generateId(),
          createdBy: username,
          updatedBy: username
        })
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const updateCategory = async (
  params: z.infer<typeof updateReqSpec> & {
    username: string
  }
) => {
  const { categoryId, field, username, ...restParams } = params
  await getCategoryLocale({ categoryId, field })
  try {
    const row = (
      await db
        .update(categoryLocale)
        .set({
          ...restParams,
          updatedBy: username,
          updatedAt: new Date().toDateString()
        })
        .where(and(eq(categoryLocale.categoryId, categoryId), eq(categoryLocale.field, field)))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}
