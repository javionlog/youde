import type { AnyColumn, SQLWrapper } from 'drizzle-orm'
import { asc, desc } from 'drizzle-orm'
import type { PgSelect } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'

export const commonFields = {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').$defaultFn(() => new Date().toISOString()),
  createdBy: text('created_by'),
  updatedBy: text('updated_by')
}

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
