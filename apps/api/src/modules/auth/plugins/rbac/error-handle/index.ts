import { APIError } from 'better-auth/api'

export const throwDbError = (err: any) => {
  throw new APIError('INTERNAL_SERVER_ERROR', {
    code: err.cause?.name,
    message: err.cause?.detail
  })
}

export const throwDataDuplicationError = (message?: string) => {
  throw new APIError('INTERNAL_SERVER_ERROR', {
    code: 'DATA_DUPLICATION',
    message: message ?? 'Data duplication'
  })
}

export const throwDataNotFoundError = (message?: string) => {
  throw new APIError('INTERNAL_SERVER_ERROR', {
    code: 'DATA_NOT_FOUND',
    message: message ?? 'Data not found'
  })
}
