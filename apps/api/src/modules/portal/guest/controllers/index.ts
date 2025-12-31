import { adminGuardController } from '@/global/controllers'
import { listTreasures } from '../services'
import { listReqSpec, promiseListResSpec } from '../specs'

const tags = ['Guest']

const app = adminGuardController.group('/guest', app =>
  app.post(
    '/treasure/list',
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
