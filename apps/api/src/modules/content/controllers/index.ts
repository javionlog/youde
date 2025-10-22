import { guardController } from '@/global/controllers'
import {
  deleteReqSchema,
  insertReqSchema,
  promiseListResSchema,
  promiseRowResSchema,
  searchReqSchema,
  updateReqSchema
} from '../schemas'
import { createThing, deleteThing, listThing, updateThing } from '../services'

const tags = ['Content']

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
        body: insertReqSchema,
        response: promiseRowResSchema
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
        body: updateReqSchema,
        response: promiseRowResSchema
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
        body: deleteReqSchema
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listThing(body)
      },
      {
        detail: { tags },
        body: searchReqSchema,
        response: promiseListResSchema
      }
    )
)

export default app
