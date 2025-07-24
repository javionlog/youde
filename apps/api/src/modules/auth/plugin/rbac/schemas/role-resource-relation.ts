import type { BetterAuthPlugin } from 'better-auth/plugins'

export const roleResourceRelationSchema = {
  roleResourceRelation: {
    fields: {
      roleId: {
        type: 'string'
      },
      resourceId: {
        type: 'string'
      }
    }
  }
} satisfies BetterAuthPlugin['schema']
