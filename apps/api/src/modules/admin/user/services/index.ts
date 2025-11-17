import { and, eq, inArray, like } from 'drizzle-orm'
import { omit, pick } from 'es-toolkit'
import { db } from '@/db'
import { adminUser } from '@/db/schemas/admin'
import { withOrderBy, withPagination } from '@/db/utils'
import {
  throwDataNotFoundError,
  throwDbError,
  throwForbiddenError,
  throwNoPermissionError,
  throwRequestError
} from '@/global/errors'
import { getHashPassword, isEmpty } from '@/global/utils'
import { listUserAdminResourceTree } from '@/modules/admin/auth/resource/services'
import { listAdminRoleResourceRelations } from '@/modules/admin/auth/role-resource-relation/services'
import { listAdminUserRoleRelations } from '@/modules/admin/auth/user-role-relation/services'
import { createAdminSession, deleteAdminSession } from '@/modules/admin/session/services'

import type {
  CreateReqType,
  DeleteReqType,
  GetReqType,
  ListReqType,
  ListResourceUsersReqType,
  ListRoleUsersReqType,
  ResetPasswordReqType,
  ResetSelfPasswordReqType,
  SignInReqType,
  SignOutReqType,
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

export const getFullAdminUser = async (params: GetReqType) => {
  const { id } = params
  const row = (await db.select().from(adminUser).where(eq(adminUser.id, id)))[0]
  if (!row) {
    throwDataNotFoundError()
  }
  return row
}

export const signIn = async (params: SignInReqType) => {
  const { username, password } = params
  const userRow = (await db.select().from(adminUser).where(eq(adminUser.username, username)))[0]
  if (!userRow) {
    throwDataNotFoundError('The user does not exist or the password is incorrect')
  }
  if (!userRow.enabled) {
    throwForbiddenError()
  }
  const hashPassword = getHashPassword(password)
  const isMatch = hashPassword === userRow.password
  if (!isMatch) {
    throwDataNotFoundError('The user does not exist or the password is incorrect')
  }
  try {
    const sessionRow = await createAdminSession({
      userId: userRow.id,
      createdByUsername: userRow.username
    })

    const resourceTree = await listUserAdminResourceTree({ userId: userRow.id })
    return {
      token: sessionRow.token,
      user: pick(userRow, ['id', 'username', 'isAdmin']),
      resourceTree
    }
  } catch (err) {
    return throwDbError(err)
  }
}

export const signOut = async (params: SignOutReqType) => {
  const { token } = params
  return await deleteAdminSession({ token })
}

export const resetAdminUserPassword = async (
  params: ResetPasswordReqType & {
    updatedByUsername: string
  }
) => {
  const { updatedByUsername, password, id } = params
  try {
    const hashPassword = getHashPassword(password)
    const row = (
      await db
        .update(adminUser)
        .set({
          password: hashPassword,
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

export const resetSelfAdminUserPassword = async (
  params: ResetSelfPasswordReqType & {
    updatedByUsername: string
    currentUserId: string
  }
) => {
  const { updatedByUsername, oldPassword, newPassword, currentUserId, id } = params
  if (currentUserId !== id) {
    throwNoPermissionError()
  }
  if (oldPassword === newPassword) {
    throwRequestError('The new password can not equal to the old password ')
  }
  const oldHashPassword = getHashPassword(oldPassword)
  const newHashPassword = getHashPassword(newPassword)
  const userRow = await getFullAdminUser({ id })
  if (oldHashPassword !== userRow.password) {
    throwRequestError('Incorrect old password')
  }
  try {
    const row = (
      await db
        .update(adminUser)
        .set({
          password: newHashPassword,
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

export const createAdminUser = async (
  params: CreateReqType & {
    createdByUsername: string
  }
) => {
  const { createdByUsername, password, ...restParams } = params
  try {
    const hashPassword = getHashPassword(password)
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
  const { id, updatedByUsername, username, enabled, isAdmin } = params
  await getAdminUser({ id })
  try {
    const row = (
      await db
        .update(adminUser)
        .set({
          username,
          enabled,
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
  const { username, enabled, isAdmin, page, pageSize, sortBy } = params

  const where = []
  const dynamicQuery = db.select().from(adminUser).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminUser.username, `%${username}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminUser.enabled, enabled))
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
  const { roleId, username, enabled, isAdmin, page, pageSize, sortBy } = params
  const userIds = (await listAdminUserRoleRelations({ roleId })).records.map(o => o.userId)

  const where = [inArray(adminUser.id, userIds)]
  const dynamicQuery = db.select().from(adminUser).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminUser.username, `%${username}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminUser.enabled, enabled))
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
  const { resourceId, username, enabled, isAdmin, page, pageSize, sortBy } = params
  const roleIds = (await listAdminRoleResourceRelations({ resourceId })).records.map(o => o.roleId)
  const userIds = (await listAdminUserRoleRelations({ roleIds })).records.map(o => o.userId)

  const where = [inArray(adminUser.id, userIds)]
  const dynamicQuery = db.select().from(adminUser).$dynamic()

  if (!isEmpty(username)) {
    where.push(like(adminUser.username, `%${username}%`))
  }
  if (!isEmpty(enabled)) {
    where.push(eq(adminUser.enabled, enabled))
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
