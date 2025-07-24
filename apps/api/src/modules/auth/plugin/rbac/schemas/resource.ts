import type { BetterAuthPlugin } from 'better-auth/plugins'
import { baseFields } from './base'

export const resourceSchema = {
  resource: {
    fields: {
      ...baseFields,
      parentId: {
        type: 'string',
        required: false
      },
      type: {
        type: 'string'
      },
      path: {
        type: 'string',
        required: false
      },
      activePath: {
        type: 'string',
        required: false
      },
      component: {
        type: 'string',
        required: false
      },
      icon: {
        type: 'string',
        required: false
      },
      isLink: {
        type: 'boolean',
        required: false,
        defaultValue: false
      },
      isCache: {
        type: 'boolean',
        required: false,
        defaultValue: false
      },
      isAffix: {
        type: 'boolean',
        required: false,
        defaultValue: false
      },
      isShow: {
        type: 'boolean',
        required: false,
        defaultValue: false
      }
    }
  }
} satisfies BetterAuthPlugin['schema']
