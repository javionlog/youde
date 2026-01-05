import { adminGuardController } from '@/global/controllers'
import { createCountry, deleteCountry, getCountry, listCountries, updateCountry } from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec,
  updateReqSpec
} from '../specs'

const tags = ['Admin-Country']

const app = adminGuardController.group('/country', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createCountry({ ...body, createdByUsername: username })
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
        return await updateCountry({ ...body, updatedByUsername: username })
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
        return await deleteCountry(body)
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
        return await getCountry(body)
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
        return await listCountries(body)
      },
      {
        detail: { tags },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
