import { APIError } from 'better-auth/api'

export const handleDbError = (err: any) => {
  throw new APIError('INTERNAL_SERVER_ERROR', {
    code: err.cause.name,
    message: err.cause.detail
  })
}
