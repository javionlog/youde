import type { AuthContext, User } from 'better-auth'
import { throwDataNotFoundError } from '../errors'

export type UserSpec = User & { username?: string }

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
