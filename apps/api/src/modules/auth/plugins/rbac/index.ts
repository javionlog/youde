import type { BetterAuthPlugin } from 'better-auth/plugins'
import { relationEndpoints } from './endpoints/relation'
import { resourceEndpoints } from './endpoints/resource'
import { resourceLocaleEndpoints } from './endpoints/resource-locale'
import { roleEndpoints } from './endpoints/role'
import { roleResourceRelationEndpoints } from './endpoints/role-resource-relation'
import { userEndpoints } from './endpoints/user'
import { userRoleRelationEndpoints } from './endpoints/user-role-relation'
import { resourceSchema } from './schemas/resource'
import { resourceLocaleSchema } from './schemas/resource-locale'
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
      ...roleResourceRelationSchema,
      ...resourceLocaleSchema
    },
    endpoints: {
      ...roleEndpoints,
      ...resourceEndpoints,
      ...resourceLocaleEndpoints,
      ...userRoleRelationEndpoints,
      ...roleResourceRelationEndpoints,
      ...relationEndpoints,
      ...userEndpoints
    }
  } satisfies BetterAuthPlugin
}
