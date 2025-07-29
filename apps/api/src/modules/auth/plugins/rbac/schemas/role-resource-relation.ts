import type { BetterAuthPlugin } from 'better-auth/plugins'

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
} satisfies BetterAuthPlugin['schema']
