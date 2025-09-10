import type { ExtendAuthPluginSchema } from '../types'
import { baseFields } from './base'

export const resourceLocaleSchema = {
  resourceLocale: {
    fields: {
      ...baseFields,
      resourceId: {
        type: 'string',
        required: true,
        input: true
      },
      field: {
        type: 'string',
        required: true,
        input: true
      },
      enUs: {
        type: 'string',
        required: true,
        input: true
      },
      zhCn: {
        type: 'string',
        required: true,
        input: true
      }
    }
  }
} satisfies ExtendAuthPluginSchema
