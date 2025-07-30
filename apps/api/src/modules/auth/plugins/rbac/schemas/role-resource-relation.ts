import type { ExtendAuthPluginSchema } from '../types'

export const roleResourceRelationSchema = {
  roleResourceRelation: {
    fields: {
      roleId: {
        type: 'string',
        required: true,
        input: true
      },
      resourceId: {
        type: 'string',
        required: true,
        input: true
      }
    }
  }
} satisfies ExtendAuthPluginSchema
