import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { treasure, treasureCategory, treasureCategoryLocale } from '@/db/schemas/common'
import { withOrderBy } from '@/db/utils'
import { CommonError, throwDataNotFoundError, throwDbError } from '@/global/errors'
import { buildTree, isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, GetReqType, ListReqType, UpdateReqType } from '../specs'

export const checkChildrenCategory = async (params: { id: string }) => {
  const { id } = params
  const treasureCategoryRow = (
    await db.select().from(treasureCategory).where(eq(treasureCategory.parentId, id))
  )[0]
  if (treasureCategoryRow) {
    throw new CommonError('Bad Request', {
      message: 'Category has children'
    })
  }
  const treasureRow = (await db.select().from(treasure).where(eq(treasure.categoryId, id)))[0]
  if (treasureRow) {
    throw new CommonError('Bad Request', {
      message: 'Category is referenced'
    })
  }
  return treasureCategoryRow
}

export const getTreasureCategory = async (params: GetReqType) => {
  const { id } = params

  const row = (await db.select().from(treasureCategory).where(eq(treasureCategory.id, id)))[0]

  const locales = await db
    .select()
    .from(treasureCategoryLocale)
    .where(eq(treasureCategoryLocale.categoryId, id))

  if (!row) {
    throwDataNotFoundError()
  }

  const result = { ...row, locales }

  return result
}

export const createTreasureCategory = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(treasureCategory)
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

export const updateTreasureCategory = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, parentId: _parentId, updatedByUsername, ...restParams } = params
  await getTreasureCategory({ id })
  try {
    const row = (
      await db
        .update(treasureCategory)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(treasureCategory.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteTreasureCategory = async (params: DeleteReqType) => {
  const { id } = params
  await checkChildrenCategory({ id })
  const result = await db.delete(treasureCategory).where(eq(treasureCategory.id, id))
  return result
}

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
