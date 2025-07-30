import type { ExtendAuthPluginSchema } from '../types'

export const userRoleRelationSchema = {
  userRoleRelation: {
    fields: {
      userId: {
        type: 'string',
        required: true,
        input: true
      },
      roleId: {
        type: 'string',
        required: true,
        input: true
      }
    }
  }
} satisfies ExtendAuthPluginSchema
