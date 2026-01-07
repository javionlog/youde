import { portalGuardController } from '@/global/controllers'
import { getTreasureCategoryLocale } from '../services'
import { getReqSpec, promiseRowResSpec } from '../specs'

const tags = ['Portal-Treasure-Category-Locale']

const app = portalGuardController.group('/treasure-category-locale', app =>
  app.get(
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
