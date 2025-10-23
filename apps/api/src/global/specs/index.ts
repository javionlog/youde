import { z } from 'zod'

export const pageSpec = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional()
})

export const idSpec = z.object({
  id: z.string()
})

export const dateJsonSpec = {
  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish()
}

export const omitReqFields = {
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true
} as const
