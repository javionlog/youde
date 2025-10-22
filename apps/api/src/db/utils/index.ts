import type { AnyColumn, SQLWrapper } from 'drizzle-orm'
import { asc, desc } from 'drizzle-orm'
import type { PgSelect } from 'drizzle-orm/pg-core'

export const withPagination = <T extends PgSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 10
) => {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}

export const withOrderBy = <T extends PgSelect>(
  qb: T,
  column: SQLWrapper | AnyColumn,
  direction: 'asc' | 'desc' = 'desc'
) => {
  const orderDirection = direction === 'asc' ? asc : desc
  return qb.orderBy(orderDirection(column))
}
