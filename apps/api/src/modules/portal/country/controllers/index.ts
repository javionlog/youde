import { portalGuardController } from '@/global/controllers'
import { listCountries } from '../services'
import { listReqSpec, promiseListResSpec } from '../specs'

const tags = ['Portal-Country']

const app = portalGuardController.group('/country', app =>
  app.post(
    '/list',
    async ({ body }) => {
      return await listCountries(body)
    },
    {
      detail: {
        tags,
        description: 'List countries'
      },
      body: listReqSpec,
      response: promiseListResSpec
    }
  )
)

export default app
