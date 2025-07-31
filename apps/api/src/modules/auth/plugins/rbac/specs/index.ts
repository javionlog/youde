import { z } from 'zod'

export const pageSpec = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional()
})

export const idSpec = z.object({
  id: z.string()
})

export const sortBySpec = z.object({
  sortBy: z
    .object({
      field: z.string(),
      direction: z.enum(['asc', 'desc'])
    })
    .optional()
    .default({ field: 'updatedAt', direction: 'desc' })
})
