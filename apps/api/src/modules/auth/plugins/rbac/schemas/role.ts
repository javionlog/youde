import type { ExtendAuthPluginSchema } from '../types'
import { baseFields } from './base'

export const roleSchema = {
  role: {
    fields: {
      ...baseFields
    }
  }
} satisfies ExtendAuthPluginSchema
