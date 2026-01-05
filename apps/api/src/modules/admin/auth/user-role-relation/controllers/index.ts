import { adminGuardController } from '@/global/controllers'
import { createUserRoleRelation, deleteUserRoleRelation, listUserRoleRelations } from '../services'
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
        const { username } = user
        return await createUserRoleRelation({ ...body, createdByUsername: username! })
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
        return await deleteUserRoleRelation(body)
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
        return await listUserRoleRelations(body)
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
