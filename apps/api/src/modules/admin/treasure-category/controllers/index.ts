import { adminGuardController } from '@/global/controllers'
import {
  createTreasureCategory,
  deleteTreasureCategory,
  getTreasureCategory,
  listTreasureCategoryTree,
  updateTreasureCategory
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  promiseRowResSpec,
  promiseTreeResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Treasure-Category']

const app = adminGuardController.group('/treasure-category', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createTreasureCategory({ ...body, createdByUsername: username })
      },
      {
        detail: {
          tags
        },
        body: createReqSpec,
        response: promiseRowResSpec.omit({ locales: true })
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await updateTreasureCategory({ ...body, updatedByUsername: username })
      },
      {
        detail: {
          tags
        },
        body: updateReqSpec,
        response: promiseRowResSpec.omit({ locales: true })
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteTreasureCategory(body)
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
        return await getTreasureCategory(body)
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
      '/tree',
      async ({ body }) => {
        return await listTreasureCategoryTree(body)
      },
      {
        detail: { tags },
        body: listReqSpec,
        response: promiseTreeResSpec
      }
    )
)

export default app
