import { z } from 'better-auth'
import type { BetterAuthPlugin } from 'better-auth/plugins'

export const pageSpec = z.object({
  offset: z.number().optional(),
  limit: z.number().optional()
})

export const baseFields = {
  createdAt: {
    type: 'date',
    input: false,
    defaultValue: () => new Date()
  },
  updatedAt: {
    type: 'date',
    input: false,
    defaultValue: () => new Date()
  },
  createdBy: {
    type: 'string',
    input: false
  },
  updatedBy: {
    type: 'string',
    input: false
  },
  name: {
    type: 'string',
    unique: true
  },
  enabled: {
    type: 'boolean',
    required: false,
    defaultValue: false
  },
  sort: {
    type: 'number',
    required: false,
    defaultValue: 0
  },
  remark: {
    type: 'string',
    required: false
  }
} satisfies NonNullable<BetterAuthPlugin['schema']>[number]['fields']
