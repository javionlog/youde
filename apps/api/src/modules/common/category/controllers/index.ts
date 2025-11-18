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
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createCategory({ ...body, createdByUsername: username })
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
        return await updateCategory({ ...body, updatedByUsername: username })
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
        return await deleteCategory(body)
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
