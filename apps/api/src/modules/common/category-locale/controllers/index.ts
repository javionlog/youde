import { adminGuardController } from '@/global/controllers'
import { createCategoryLocale, getCategoryLocale, updateCategory } from '../services'
import { createReqSpec, getReqSpec, promiseRowResSpec, updateReqSpec } from '../specs'

const tags = ['Category']

const app = adminGuardController.group('/category-locale', app =>
  app
    .post(
      '/create',
      async ({ body, user }) => {
        const { id, username } = user
        return await createCategoryLocale({ ...body, userId: id, username: username! })
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
        return await updateCategory({ ...body, username: username! })
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
      '/get',
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
