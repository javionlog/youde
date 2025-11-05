import { guardController } from '@/global/controllers'
import { listThings } from '../services'
import { promiseListResSpec, searchReqSpec } from '../specs'

const tags = ['Guest']

const app = guardController.group('/guest', app =>
  app.post(
    '/thing/list',
    async ({ body }) => {
      return await listThings(body)
    },
    {
      detail: { tags },
      body: searchReqSpec,
      response: promiseListResSpec
    }
  )
)

export default app
