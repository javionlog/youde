import type { BetterAuthPlugin } from 'better-auth/plugins'

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
} satisfies BetterAuthPlugin['schema']
