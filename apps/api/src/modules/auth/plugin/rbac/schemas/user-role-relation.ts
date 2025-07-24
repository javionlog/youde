import type { BetterAuthPlugin } from 'better-auth/plugins'

export const userRoleRelationSchema = {
  userRoleRelation: {
    fields: {
      userId: {
        type: 'string'
      },
      roleId: {
        type: 'string'
      }
    }
  }
} satisfies BetterAuthPlugin['schema']
