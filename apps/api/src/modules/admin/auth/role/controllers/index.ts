import { adminGuardController } from '@/global/controllers'
import {
  createAdminRole,
  deleteAdminRole,
  getAdminRole,
  listAdminRoles,
  listResourceAdminRoles,
  listUserAdminRoles,
  listUserGrantAdminRoles,
  updateAdminRole
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
        return await createAdminRole({ ...body, createdByUsername: username! })
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
        return await updateAdminRole({ ...body, updatedByUsername: username! })
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
        return await deleteAdminRole(body)
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
        return await getAdminRole(query)
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
        return await listAdminRoles(body)
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
        return await listUserAdminRoles(body)
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
        return await listUserGrantAdminRoles(body)
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
        return await listResourceAdminRoles(body)
      },
      {
        detail: { tags, description: 'List resource roles' },
        body: listResourceRolesReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
