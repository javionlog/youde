import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { category, categoryLocale, thing } from '@/db/schemas/common'
import { withOrderBy } from '@/db/utils'
import { CommonError, throwDataNotFoundError, throwDbError } from '@/global/errors'
import { buildTree, isEmpty } from '@/global/utils'
import type { CreateReqType, DeleteReqType, GetReqType, ListReqType, UpdateReqType } from '../specs'

export const checkChildrenCategory = async (params: { id: string }) => {
  const { id } = params
  const categoryRow = (await db.select().from(category).where(eq(category.parentId, id)))[0]
  if (categoryRow) {
    throw new CommonError('Bad Request', {
      message: 'Category has children'
    })
  }
  const thingRow = (await db.select().from(thing).where(eq(thing.categoryId, id)))[0]
  if (thingRow) {
    throw new CommonError('Bad Request', {
      message: 'Category is referenced'
    })
  }
  return categoryRow
}

export const getCategory = async (params: GetReqType) => {
  const { id } = params

  const row = (await db.select().from(category).where(eq(category.id, id)))[0]

  const locales = await db.select().from(categoryLocale).where(eq(categoryLocale.categoryId, id))

  if (!row) {
    throwDataNotFoundError()
  }

  const result = { ...row, locales }

  return result
}

export const createCategory = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, ...restParams } = params
  try {
    const row = (
      await db
        .insert(category)
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

export const updateCategory = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, parentId: _parentId, updatedByUsername, ...restParams } = params
  await getCategory({ id })
  try {
    const row = (
      await db
        .update(category)
        .set({
          ...restParams,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(category.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteCategory = async (params: DeleteReqType) => {
  const { id } = params
  await checkChildrenCategory({ id })
  const result = await db.delete(category).where(eq(category.id, id))
  return result
}

export const listCategoryTree = async (params: ListReqType) => {
  const { enabled } = params

  const dynamicQuery = db.select().from(category).$dynamic()
  const where = []

  if (!isEmpty(enabled)) {
    where.push(eq(category.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, category.sort, 'asc')

  const records = await dynamicQuery

  const locales = await db
    .select()
    .from(categoryLocale)
    .where(
      inArray(
        categoryLocale.categoryId,
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
