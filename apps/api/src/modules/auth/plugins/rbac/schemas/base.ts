import type { ExtendAuthPluginSchema } from '../types'

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
  }
} satisfies ExtendAuthPluginSchema[number]['fields']
