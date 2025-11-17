import { adminGuardController } from '@/global/controllers'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategoryTree,
  updateCategory
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  promiseRowResSpec,
  promiseTreeResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Category']

const app = adminGuardController.group('/category', app =>
  app
    .post(
      '/create',
      async ({ body, user }) => {
        const { id, username } = user
        return await createCategory({ ...body, userId: id, username: username! })
      },
      {
        detail: {
          tags
        },
        body: createReqSpec,
        response: promiseRowResSpec.omit({ locales: true })
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
        response: promiseRowResSpec.omit({ locales: true })
      }
    )
    .post(
      '/delete',
      async ({ body }) => {
        return await deleteCategory(body)
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
        return await getCategory(body)
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
      async () => {
        return await listCategoryTree({})
      },
      {
        detail: { tags },
        response: promiseTreeResSpec
      }
    )
    .post(
      '/enabled-tree',
      async () => {
        return await listCategoryTree({ enabled: true })
      },
      {
        detail: { tags },
        response: promiseTreeResSpec
      }
    )
)

export default app
