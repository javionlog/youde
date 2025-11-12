import { adminGuardController } from '@/global/controllers'
import {
  createAdminRoleResourceRelation,
  deleteAdminRoleResourceRelation,
  listAdminRoleResourceRelations
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec
} from '../specs'

const tags = ['Admin-Role-Resource-Relation']

const app = adminGuardController.group('/role-resource-relation', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user!
        return await createAdminRoleResourceRelation({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create role resource relation'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteAdminRoleResourceRelation(body)
      },
      {
        detail: {
          tags,
          description: 'Delete role resource relation'
        },
        body: deleteReqSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listAdminRoleResourceRelations(body)
      },
      {
        detail: {
          tags,
          description: 'List role resource relations'
        },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
