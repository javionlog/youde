import { adminGuardController } from '@/global/controllers'
import { createResourceLocale, getResourceLocale, updateResourceLocale } from '../services'
import { createReqSpec, getReqSpec, promiseRowResSpec, updateReqSpec } from '../specs'

const tags = ['Admin-Resource-Locale']

const app = adminGuardController.group('/resource-locale', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createResourceLocale({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create resource locale'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await updateResourceLocale({ ...body, updatedByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Update resource locale'
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .get(
      '',
      async ({ query }) => {
        return await getResourceLocale(query)
      },
      {
        detail: {
          tags,
          description: 'Get resource locale'
        },
        query: getReqSpec,
        response: promiseRowResSpec
      }
    )
)

export default app
