import { adminGuardController } from '@/global/controllers'
import {
  createRoleResourceRelation,
  deleteRoleResourceRelation,
  listRoleResourceRelations,
  setManyRoleResourceRelations
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec,
  setManyReqSpec
} from '../specs'

const tags = ['Admin-Role-Resource-Relation']

const app = adminGuardController.group('/role-resource-relation', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createRoleResourceRelation({ ...body, createdByUsername: username! })
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
    .post(
      '/set-many',
      async ({ body, user }) => {
        const { username } = user
        return await setManyRoleResourceRelations({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Set many role resource relations'
        },
        body: setManyReqSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteRoleResourceRelation(body)
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
        return await listRoleResourceRelations(body)
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
