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

const tags = ['Admin-Treasure-Category']

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
          tags,
          description: 'Create treasure category'
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
          tags,
          description: 'Update treasure category'
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
          tags,
          description: 'Delete treasure category'
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
          tags,
          description: 'Get treasure category'
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
        detail: {
          tags,
          description: 'List treasure category tree'
        },
        body: listReqSpec,
        response: promiseTreeResSpec
      }
    )
)

export default app
