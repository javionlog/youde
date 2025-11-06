import { generateId } from 'better-auth'
import { and, eq, inArray } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { category, categoryLocale, thing } from '@/db/schemas/thing'
import { withOrderBy } from '@/db/utils'
import { CommonError, throwDataNotFoundError, throwDbError } from '@/global/errors'
import { buildTree, convertDateValues, isEmpty } from '@/global/utils'
import type { insertReqSpec, searchReqSpec, updateReqSpec } from '../specs'

export const checkChildrenCategory = async (params: { id: string }) => {
  const { id } = params
  const categoryRow = (await db.select().from(category).where(eq(category.parentId, id)))[0]
  if (categoryRow) {
    throw new CommonError('BAD_REQUEST', {
      code: 'Category_HAS_CHILDREN',
      message: 'Category has children'
    })
  }
  const thingRow = (await db.select().from(thing).where(eq(thing.categoryId, id)))[0]
  if (thingRow) {
    throw new CommonError('BAD_REQUEST', {
      code: 'Category_IS_REFERENCED',
      message: 'Category is referenced'
    })
  }
  return categoryRow
}

export const getCategory = async (params: { id: string }) => {
  const { id } = params

  const row = (await db.select().from(category).where(eq(category.id, id)))[0]

  const locales = (
    await db.select().from(categoryLocale).where(eq(categoryLocale.categoryId, id))
  ).map(convertDateValues)

  if (!row) {
    throwDataNotFoundError()
  }

  const result = convertDateValues({ ...row, locales })

  return result
}

export const createCategory = async (
  params: z.infer<typeof insertReqSpec> & {
    userId: string
    username: string
  }
) => {
  const { username, ...restParams } = params
  try {
    const row = (
      await db
        .insert(category)
        .values({
          ...restParams,
          id: generateId(),
          createdBy: username,
          updatedBy: username
        })
        .returning()
    )[0]
    return convertDateValues(row)
  } catch (err) {
    return throwDbError(err)
  }
}

export const updateCategory = async (
  params: z.infer<typeof updateReqSpec> & {
    username: string
  }
) => {
  const { id, parentId: _parentId, username, ...restParams } = params
  await getCategory({ id })
  try {
    const row = (
      await db
        .update(category)
        .set({
          ...restParams,
          updatedBy: username,
          updatedAt: new Date().toDateString()
        })
        .where(eq(category.id, id))
        .returning()
    )[0]
    return convertDateValues(row)
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteCategory = async (params: { id: string }) => {
  const { id } = params
  await checkChildrenCategory({ id })
  const result = await db.delete(category).where(eq(category.id, id))
  return result
}

export const listCategoryTree = async (params: z.infer<typeof searchReqSpec>) => {
  const { enabled } = params

  const dynamicQuery = db.select().from(category).$dynamic()
  const where = []

  if (!isEmpty(enabled)) {
    where.push(eq(category.enabled, enabled))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, category.sort, 'asc')

  const records = (await dynamicQuery).map(convertDateValues)

  const locales = (
    await db
      .select()
      .from(categoryLocale)
      .where(
        inArray(
          categoryLocale.categoryId,
          records.map(o => o.id)
        )
      )
  ).map(convertDateValues)

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
