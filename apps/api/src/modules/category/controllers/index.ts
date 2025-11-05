import { guardController } from '@/global/controllers'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategoryTree,
  updateCategory
} from '../services'
import {
  deleteReqSpec,
  getReqSpec,
  insertReqSpec,
  promiseRowResSpec,
  promiseTreetResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Category']

const app = guardController.group('/category', app =>
  app
    .post(
      '/create',
      async ({ body, user }) => {
        const { id, username } = user!
        return await createCategory({ ...body, userId: id, username: username! })
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
        response: promiseTreetResSpec
      }
    )
    .post(
      '/enabled-tree',
      async () => {
        return await listCategoryTree({ enabled: true })
      },
      {
        detail: { tags },
        response: promiseTreetResSpec
      }
    )
)

export default app
