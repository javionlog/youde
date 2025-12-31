import { adminGuardController } from '@/global/controllers'
import {
  createTreasure,
  deleteTreasure,
  getTreasure,
  listTreasures,
  updateTreasure
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Treasure']

const app = adminGuardController.group('/treasure', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { id, username } = user
        return await createTreasure({ ...body, userId: id, createdByUsername: username })
      },
      {
        detail: {
          tags
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await updateTreasure({ ...body, updatedByUsername: username })
      },
      {
        detail: {
          tags
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteTreasure(body)
      },
      {
        detail: {
          tags
        },
        body: deleteReqSpec
      }
    )
    .get(
      '',
      async ({ body }) => {
        return await getTreasure(body)
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
        return await listTreasures(body)
      },
      {
        detail: { tags },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
