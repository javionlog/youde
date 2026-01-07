import { portalGuardController } from '@/global/controllers'
import { getTreasure, listTreasures } from '../services'
import { getReqSpec, listReqSpec, promiseListResSpec, promiseRowResSpec } from '../specs'

const tags = ['Portal-Treasure']

const app = portalGuardController.group('/treasure', app =>
  app
    .get(
      '',
      async ({ body }) => {
        return await getTreasure(body)
      },
      {
        detail: {
          tags,
          description: 'Get treasure'
        },
        body: getReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listTreasures(body)
      },
      {
        detail: {
          tags,
          description: 'List treasures'
        },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
