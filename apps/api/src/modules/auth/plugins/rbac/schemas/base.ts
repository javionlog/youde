import type { ExtendAuthPluginSchema } from '../types'

export const baseFields = {
  createdAt: {
    type: 'string',
    required: false,
    input: false,
    defaultValue: () => new Date().toISOString()
  },
  updatedAt: {
    type: 'string',
    required: false,
    input: false,
    defaultValue: () => new Date().toDateString()
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
  }
} satisfies ExtendAuthPluginSchema[number]['fields']
