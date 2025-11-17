import { adminGuardController } from '@/global/controllers'
import { createThing, deleteThing, getThing, listThings, updateThing } from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Thing']

const app = adminGuardController.group('/thing', app =>
  app
    .post(
      '/create',
      async ({ body, user }) => {
        const { id, username } = user
        return await createThing({ ...body, userId: id, username: username! })
      },
      {
        detail: {
          tags
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/update',
      async ({ body, user }) => {
        const { username } = user
        return await updateThing({ ...body, username: username! })
      },
      {
        detail: {
          tags
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/delete',
      async ({ body }) => {
        return await deleteThing(body)
      },
      {
        detail: {
          tags
        },
        body: deleteReqSpec
      }
    )
    .post(
      '/get',
      async ({ body }) => {
        return await getThing(body)
      },
      {
        detail: {
          tags
        },
        body: getReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listThings(body)
      },
      {
        detail: { tags },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
