import { z } from 'zod'
import type { ExtendAuthPluginSchema } from '../types'

export const pageSpec = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional()
})

export const baseFields = {
  createdAt: {
    type: 'date',
    required: false,
    input: false,
    defaultValue: () => new Date()
  },
  updatedAt: {
    type: 'date',
    required: false,
    input: false,
    defaultValue: () => new Date()
  },
  createdBy: {
    type: 'string',
    required: false,
    input: false
  },
  updatedBy: {
    type: 'string',
    required: false,
    input: false
  },
  name: {
    type: 'string',
    required: true,
    input: true,
    unique: true
  },
  enabled: {
    type: 'boolean',
    required: false,
    input: true
  },
  remark: {
    type: 'string',
    required: false,
    input: true
  }
} satisfies ExtendAuthPluginSchema[number]['fields']
