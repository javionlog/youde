import { guardController } from '@/global/controllers'
import { createThing, deleteThing, getThing, listThing, updateThing } from '../services'
import {
  deleteReqSpec,
  getReqSpec,
  insertReqSpec,
  promiseListResSpec,
  promiseRowResSpec,
  searchReqSpec,
  updateReqSpec
} from '../specs'

const tags = ['Thing']

const app = guardController.group('/thing', app =>
  app
    .post(
      '/create',
      async ({ body, user }) => {
        const { id, username } = user!
        return await createThing({ ...body, userId: id, username: username! })
      },
      {
        detail: {
          tags
        },
        body: insertReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/update',
      async ({ body, user }) => {
        const { username } = user!
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
        return await listThing(body)
      },
      {
        detail: { tags },
        body: searchReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
