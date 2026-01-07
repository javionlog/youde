import { portalGuardController } from '@/global/controllers'
import { listTreasureCategoryTree } from '../services'
import { listReqSpec, promiseTreeResSpec } from '../specs'

const tags = ['Portal-Treasure-Category']

const app = portalGuardController.group('/treasure-category', app =>
  app.post(
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
