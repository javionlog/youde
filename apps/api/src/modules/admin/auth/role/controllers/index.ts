import { adminGuardController } from '@/global/controllers'
import {
  createRole,
  deleteRole,
  getRole,
  listResourceRoles,
  listRoles,
  listUserGrantRoles,
  listUserRoles,
  updateRole
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  listResourceRolesReqSpec,
  listUserGrantRolesReqSpec,
  listUserRolesReqSpec,
  promiseListResSpec,
  promiseListUserGrantRolesResSpec,
  promiseRowResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Admin-Role']

const app = adminGuardController.group('/role', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createRole({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create role'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await updateRole({ ...body, updatedByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Update role'
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteRole(body)
      },
      {
        detail: {
          tags,
          description: 'Delete role'
        },
        body: deleteReqSpec
      }
    )
    .get(
      '',
      async ({ query }) => {
        return await getRole(query)
      },
      {
        detail: {
          tags,
          description: 'Get role'
        },
        query: getReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listRoles(body)
      },
      {
        detail: { tags, description: 'List roles' },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
    .post(
      '/user-role-list',
      async ({ body }) => {
        return await listUserRoles(body)
      },
      {
        detail: { tags, description: 'List user roles' },
        body: listUserRolesReqSpec,
        response: promiseListResSpec
      }
    )
    .post(
      '/user-grant-role-list',
      async ({ body }) => {
        return await listUserGrantRoles(body)
      },
      {
        detail: { tags, description: 'List user grant roles' },
        body: listUserGrantRolesReqSpec,
        response: promiseListUserGrantRolesResSpec
      }
    )
    .post(
      '/resource-role-list',
      async ({ body }) => {
        return await listResourceRoles(body)
      },
      {
        detail: { tags, description: 'List resource roles' },
        body: listResourceRolesReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
