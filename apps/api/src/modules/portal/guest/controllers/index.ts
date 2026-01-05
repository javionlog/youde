import { adminGuardController } from '@/global/controllers'
import { listTreasures } from '../services'
import { listReqSpec, promiseListResSpec } from '../specs'

const tags = ['Portal-Treasure']

const app = adminGuardController.group('/treasure', app =>
  app.post(
    '/list',
    async ({ body }) => {
      return await listTreasures(body)
    },
    {
      detail: { tags },
      body: listReqSpec,
      response: promiseListResSpec
    }
  )
)

export default app
