import { and, eq, inArray, like } from 'drizzle-orm'
import { omit, pick } from 'es-toolkit'
import { db } from '@/db'
import { adminUser } from '@/db/schemas/admin'
import { withOrderBy, withPagination } from '@/db/utils'
import { throwDataNotFoundError, throwDbError } from '@/global/errors'
import { isEmpty } from '@/global/utils'
import { listAdminRoleResourceRelations } from '@/modules/admin/auth/role-resource-relation/services'
import { listAdminUserRoleRelations } from '@/modules/admin/auth/user-role-relation/services'
import { createAdminSession } from '@/modules/admin/session/services'

import type {
  CreateReqType,
  DeleteReqType,
  GetReqType,
  ListReqType,
  ListResourceUsersReqType,
  ListRoleUsersReqType,
  SignInReqType,
  UpdateReqType
} from '../specs'

export const getAdminUser = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(adminUser).where(eq(adminUser.id, id)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return omit(row, ['password'])
}

export const signIn = async (params: SignInReqType) => {
  const { username, password } = params
  const userRow = (await db.select().from(adminUser).where(eq(adminUser.username, username)))[0]
  if (!userRow) {
    throwDataNotFoundError('The user does not exist or the password is incorrect')
  }
  const isMatch = Bun.password.verifySync(password, userRow.password)
  if (!isMatch) {
    throwDataNotFoundError('The user does not exist or the password is incorrect')
  }
  try {
    const sessionRow = await createAdminSession({
      userId: userRow.id,
      createdByUsername: userRow.username
    })

    return {
      token: sessionRow.token,
      user: pick(userRow, ['id', 'username'])
    }
  } catch (err) {
    return throwDbError(err)
  }
}

export const createAdminUser = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, password, ...restParams } = params
  try {
    const hashPassword = Bun.password.hashSync(password)
    const row = (
      await db
        .insert(adminUser)
        .values({
          password: hashPassword,
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

export const updateAdminUser = async (
  params: UpdateReqType & {
    updatedByUsername: string
  }
) => {
  const { id, updatedByUsername, username, banned, isAdmin } = params
  await getAdminUser({ id })
  try {
    const row = (
      await db
        .update(adminUser)
        .set({
          username,
          banned,
          isAdmin,
          updatedBy: updatedByUsername,
          updatedAt: new Date().toDateString()
        })
        .where(eq(adminUser.id, id))
        .returning()
    )[0]
    return row
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteAdminUser = async (params: DeleteReqType) => {
  const { id } = params
  const result = await db.delete(adminUser).where(eq(adminUser.id, id))
  return result
}

export const listAdminUsers = async (params: ListReqType) => {
  const { username, banned, isAdmin, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(adminUser).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminUser.username, `%${username}%`))
  }
  if (!isEmpty(banned)) {
    where.push(eq(adminUser.banned, banned))
  }
  if (!isEmpty(isAdmin)) {
    where.push(eq(adminUser.isAdmin, isAdmin))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminUser[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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

export const listRoleAdminUsers = async (params: ListRoleUsersReqType) => {
  const { roleId, username, banned, isAdmin, page, pageSize, sortBy } = params
  const userIds = (await listAdminUserRoleRelations({ roleId })).records.map(o => o.userId)

  const where = [inArray(adminUser.id, userIds)]
  const dynamicQuery = db.select().from(adminUser).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminUser.username, `%${username}%`))
  }
  if (!isEmpty(banned)) {
    where.push(eq(adminUser.banned, banned))
  }
  if (!isEmpty(isAdmin)) {
    where.push(eq(adminUser.isAdmin, isAdmin))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminUser[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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

export const listResourceAdminUsers = async (params: ListResourceUsersReqType) => {
  const { resourceId, username, banned, isAdmin, page, pageSize, sortBy } = params
  const roleIds = (await listAdminRoleResourceRelations({ resourceId })).records.map(o => o.roleId)
  const userIds = (await listAdminUserRoleRelations({ roleIds })).records.map(o => o.userId)

  const where = [inArray(adminUser.id, userIds)]
  const dynamicQuery = db.select().from(adminUser).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminUser.username, `%${username}%`))
  }
  if (!isEmpty(banned)) {
    where.push(eq(adminUser.banned, banned))
  }
  if (!isEmpty(isAdmin)) {
    where.push(eq(adminUser.isAdmin, isAdmin))
  }
  dynamicQuery.where(and(...where))
  withOrderBy(dynamicQuery, adminUser[sortBy?.field ?? 'updatedAt'], sortBy?.direction)

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
