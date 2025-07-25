import type { BetterAuthPlugin } from 'better-auth/plugins'
import { roleEndpoints } from './endpoints/role'
import { resourceSchema } from './schemas/resource'
import { roleSchema } from './schemas/role'
import { roleResourceRelationSchema } from './schemas/role-resource-relation'
import { userRoleRelationSchema } from './schemas/user-role-relation'

export const rbac = () => {
  return {
    id: 'rbac',
    schema: {
      ...roleSchema,
      ...resourceSchema,
      ...userRoleRelationSchema,
      ...roleResourceRelationSchema
    },
    endpoints: {
      ...roleEndpoints
    }
  } satisfies BetterAuthPlugin
}
