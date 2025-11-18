import { adminGuardController } from '@/global/controllers'
import { createCategoryLocale, getCategoryLocale, updateCategoryLocale } from '../services'
import { createReqSpec, getReqSpec, promiseRowResSpec, updateReqSpec } from '../specs'

const tags = ['Category']

const app = adminGuardController.group('/category-locale', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createCategoryLocale({ ...body, createdByUsername: username! })
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
        return await updateCategoryLocale({ ...body, updatedByUsername: username! })
      },
      {
        detail: {
          tags
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .get(
      '',
      async ({ body }) => {
        return await getCategoryLocale(body)
      },
      {
        detail: {
          tags
        },
        body: getReqSpec,
        response: promiseRowResSpec
      }
    )
)

export default app
