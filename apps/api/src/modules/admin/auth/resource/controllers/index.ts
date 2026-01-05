import { adminGuardController } from '@/global/controllers'
import {
  createResource,
  deleteResource,
  getResource,
  listResourceTree,
  listRoleGrantResourceTree,
  listRoleResourceTree,
  listUserResourceTree,
  updateResource
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  listRoleGrantResourcesReqSpec,
  listRoleResourcesReqSpec,
  listUserResourcesReqSpec,
  promiseGrantTreeResSpec,
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
        const { username } = user
        return await createResource({ ...body, createdByUsername: username! })
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
        const { username } = user
        return await updateResource({ ...body, updatedByUsername: username! })
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
        return await deleteResource(body)
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
        return await getResource(query)
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
        return await listResourceTree(body)
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
        return await listUserResourceTree(body)
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
        return await listRoleResourceTree(body)
      },
      {
        detail: { tags, description: 'List role resource tree' },
        body: listRoleResourcesReqSpec,
        response: promiseTreeResSpec
      }
    )
    .post(
      '/role-grant-resource-tree',
      async ({ body }) => {
        return await listRoleGrantResourceTree(body)
      },
      {
        detail: { tags, description: 'List role grant resource tree' },
        body: listRoleGrantResourcesReqSpec,
        response: promiseGrantTreeResSpec
      }
    )
)

export default app
