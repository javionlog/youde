import type { AuthContext } from 'better-auth'
import { z } from 'zod'
import { throwDataDuplicationError, throwDataNotFoundError } from '../errors'
import { pageSpec, sortBySpec } from '../specs'

export const userSpec = z.object({
  name: z.string(),
  username: z.string(),
  displayUsername: z.string().nullish(),
  email: z.string(),
  password: z.string()
})

export const userListSpec = z.object({
  ...pageSpec.shape,
  ...sortBySpec.shape,
  username: z.string().nullish(),
  displayUsername: z.string().nullish(),
  email: z.string().nullish()
})

export type UserSpec = z.infer<typeof userSpec> & { id: string }

export const getOneUser = async (ctx: AuthContext, id: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<UserSpec>({
    model: 'user',
    where: [{ field: 'id', value: id }]
  })
  if (!row) {
    return throwDataNotFoundError()
  }
  return row
}

export const checkUsername = async (ctx: AuthContext, username: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<UserSpec>({
    model: 'user',
    where: [{ field: 'username', value: username }]
  })
  if (row) {
    return throwDataDuplicationError('Username duplication')
  }
  return row
}

export const checkEmail = async (ctx: AuthContext, email: string) => {
  const { adapter } = ctx
  const row = await adapter.findOne<UserSpec>({
    model: 'user',
    where: [{ field: 'email', value: email }]
  })
  if (row) {
    return throwDataDuplicationError('E-mail duplication')
  }
  return row
}
