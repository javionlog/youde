import { guardController } from '@/global/controllers'
import { deleteSchema, insertSchema, promiseListSchema, promiseRowSchema } from '../schemas'
import { createThing, deleteThing, listThing } from '../services'

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
        body: insertSchema,
        response: promiseRowSchema
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
        body: deleteSchema
      }
    )
    .post(
      '/list',
      async () => {
        return await listThing()
      },
      {
        detail: { tags },
        response: promiseListSchema
      }
    )
)

export default app
