import { adminGuardController } from '@/global/controllers'
import {
  createAdminResource,
  deleteAdminResource,
  getAdminResource,
  listAdminResourceTree,
  listRoleAdminResourceTree,
  listUserAdminResourceTree,
  updateAdminResource
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  listRoleResourcesReqSpec,
  listUserResourcesReqSpec,
  promiseRowResSpec,
  promiseTreeResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Admin-Resource']

const app = adminGuardController.group('/resource', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user!
        return await createAdminResource({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create resource'
        },
        body: createReqSpec,
        response: promiseRowResSpec.omit({ locales: true })
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user!
        return await updateAdminResource({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Update resource'
        },
        body: updateReqSpec,
        response: promiseRowResSpec.omit({ locales: true })
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteAdminResource(body)
      },
      {
        detail: {
          tags,
          description: 'Delete resource'
        },
        body: deleteReqSpec
      }
    )
    .get(
      '',
      async ({ query }) => {
        return await getAdminResource(query)
      },
      {
        detail: {
          tags,
          description: 'Get resource'
        },
        query: getReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/tree',
      async ({ body }) => {
        return await listAdminResourceTree(body)
      },
      {
        detail: { tags, description: 'List resource tree' },
        body: listReqSpec,
        response: promiseTreeResSpec
      }
    )
    .post(
      '/user-resource-tree',
      async ({ body }) => {
        return await listUserAdminResourceTree(body)
      },
      {
        detail: { tags, description: 'List user resource tree' },
        body: listUserResourcesReqSpec,
        response: promiseTreeResSpec
      }
    )
    .post(
      '/role-resource-tree',
      async ({ body }) => {
        return await listRoleAdminResourceTree(body)
      },
      {
        detail: { tags, description: 'List role resource tree' },
        body: listRoleResourcesReqSpec,
        response: promiseTreeResSpec
      }
    )
)

export default app
