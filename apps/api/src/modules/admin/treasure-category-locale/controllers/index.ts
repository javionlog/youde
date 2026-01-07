import { adminGuardController } from '@/global/controllers'
import {
  createTreasureCategoryLocale,
  getTreasureCategoryLocale,
  updateTreasureCategoryLocale
} from '../services'
import { createReqSpec, getReqSpec, promiseRowResSpec, updateReqSpec } from '../specs'

const tags = ['Admin-Treasure-Category-Locale']

const app = adminGuardController.group('/treasure-category-locale', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createTreasureCategoryLocale({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create treasure category locale'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await updateTreasureCategoryLocale({ ...body, updatedByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Update treasure category locale'
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .get(
      '',
      async ({ body }) => {
        return await getTreasureCategoryLocale(body)
      },
      {
        detail: {
          tags,
          description: 'Get treasure category locale'
        },
        body: getReqSpec,
        response: promiseRowResSpec
      }
    )
)

export default app
