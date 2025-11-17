import { adminGuardController } from '@/global/controllers'
import { listThings } from '../services'
import { listReqSpec, promiseListResSpec } from '../specs'

const tags = ['Guest']

const app = adminGuardController.group('/guest', app =>
  app.post(
    '/thing/list',
    async ({ body }) => {
      return await listThings(body)
    },
    {
      detail: { tags },
      body: listReqSpec,
      response: promiseListResSpec
    }
  )
)

export default app
