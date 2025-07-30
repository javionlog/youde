import type { ExtendAuthPluginSchema } from '../types'
import { baseFields } from './base'

export const resourceSchema = {
  resource: {
    fields: {
      ...baseFields,
      sort: {
        type: 'number',
        required: false,
        input: true
      },
      parentId: {
        type: 'string',
        required: false,
        input: true
      },
      type: {
        type: 'string',
        required: true,
        input: true,
        enum: ['Menu', 'Page', 'Element']
      },
      path: {
        type: 'string',
        required: false,
        input: true
      },
      activePath: {
        type: 'string',
        required: false,
        input: true
      },
      component: {
        type: 'string',
        required: false,
        input: true
      },
      icon: {
        type: 'string',
        required: false,
        input: true
      },
      isLink: {
        type: 'boolean',
        required: false,
        input: true
      },
      isCache: {
        type: 'boolean',
        required: false,
        input: true
      },
      isAffix: {
        type: 'boolean',
        required: false,
        input: true
      },
      isShow: {
        type: 'boolean',
        required: false,
        input: true
      }
    }
  }
} satisfies ExtendAuthPluginSchema
