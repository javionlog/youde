import { adminGuardController } from '@/global/controllers'
import {
  createAdminUserRoleRelation,
  deleteAdminUserRoleRelation,
  listAdminUserRoleRelations
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec
} from '../specs'

const tags = ['Admin-User-Role-Relation']

const app = adminGuardController.group('/user-role-relation', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user!
        return await createAdminUserRoleRelation({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create user role relation'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteAdminUserRoleRelation(body)
      },
      {
        detail: {
          tags,
          description: 'Delete user role relation'
        },
        body: deleteReqSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listAdminUserRoleRelations(body)
      },
      {
        detail: {
          tags,
          description: 'List user role relations'
        },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
