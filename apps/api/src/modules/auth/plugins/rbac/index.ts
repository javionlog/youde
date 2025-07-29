import type { BetterAuthPlugin } from 'better-auth/plugins'
import { relationEndpoints } from './endpoints/relation'
import { resourceEndpoints } from './endpoints/resource'
import { roleEndpoints } from './endpoints/role'
import { roleResourceRelationEndpoints } from './endpoints/role-resource-relation'
import { userRoleRelationEndpoints } from './endpoints/user-role-relation'
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
      ...roleEndpoints,
      ...resourceEndpoints,
      ...userRoleRelationEndpoints,
      ...roleResourceRelationEndpoints,
      ...relationEndpoints
    }
  } satisfies BetterAuthPlugin
}
