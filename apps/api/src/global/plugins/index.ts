import { openapi as openapiPlugin } from '@elysiajs/openapi'
import { staticPlugin } from '@elysiajs/static'
import { z } from 'zod'
import { baseController } from '@/global/controllers'
import openapi from './openapi'

const app = baseController
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/public'
    })
  )
  .use(
    openapiPlugin({
      path: '/scalar',
      scalar: {
        cdn: '/public/scalar/standalone.js'
      },
      mapJsonSchema: {
        zod: z.toJSONSchema
      }
    })
  )
  .use(openapi)

export default app
