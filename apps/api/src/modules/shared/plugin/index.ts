import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { baseController } from '../controller'
import openapi from './openapi'

const app = baseController
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/public'
    })
  )
  .use(
    swagger({
      path: '/scalar',
      scalarCDN: '/public/scalar/standalone.js'
    })
  )
  .use(openapi)

export default app
