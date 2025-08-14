import { z } from 'zod'

import { roleResourceRelationSpec } from '../services/role-resource-relation'
import { userRoleRelationSpec } from '../services/user-role-relation'
import { pageSpec, sortBySpec } from '../specs'

export const relationListSpec = z.object({
  ...pageSpec.shape,
  ...userRoleRelationSpec.shape,
  ...roleResourceRelationSpec.shape,
  ...sortBySpec.shape,
  roleName: z.string().nullish(),
  username: z.string().nullish(),
  resourceName: z.string().nullish(),
  resourceType: z.enum(['Menu', 'Page', 'Element']).nullish()
})
