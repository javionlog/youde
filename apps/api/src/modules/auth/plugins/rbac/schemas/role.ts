import type { ExtendAuthPluginSchema } from '../types'
import { baseFields } from './base'

export const roleSchema = {
  role: {
    fields: {
      ...baseFields,
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
    }
  }
} satisfies ExtendAuthPluginSchema
