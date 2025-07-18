import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import Scalar from './scalar'

const app = new Elysia()

app
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/public'
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: 'API Doc',
          version: '1.0.0',
          description: 'API documentation'
        }
      },
      path: '/scalar',
      scalarCDN: '/public/scalar/standalone.js'
    })
  )
  .use(Scalar)
export default app
