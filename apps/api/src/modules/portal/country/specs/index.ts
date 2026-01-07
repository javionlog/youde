import { getTableColumns } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { country } from '@/db/schemas/common'
import { pageSpec } from '@/global/specs'
import { getKeys } from '@/global/utils'

export const rowSpec = createSelectSchema(country).omit({})
export type RowType = z.infer<typeof rowSpec>

export const rowResSpec = createSelectSchema(country).omit({})

export const listResSpec = z.object({
  records: z.array(rowResSpec),
  total: z.number()
})

export const promiseRowResSpec = z.promise(rowResSpec)

export const promiseListResSpec = z.promise(listResSpec)

export const listReqSpec = z.object({
  ...pageSpec.shape,
  codes: z.array(z.string()).nullish(),
  regions: z.array(z.string()).nullish(),
  enUs: z.array(z.string()).nullish(),
  zhCn: z.array(z.string()).nullish(),
  sortBy: z
    .object({
      field: z.enum(getKeys(getTableColumns(country))),
      direction: z.enum(['asc', 'desc'])
    })
    .partial()
    .nullish()
})
export type ListReqType = z.infer<typeof listReqSpec>
