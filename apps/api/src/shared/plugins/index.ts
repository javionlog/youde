import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import openapi from './openapi'

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
      path: '/scalar',
      scalarCDN: '/public/scalar/standalone.js'
    })
  )
  .use(openapi)
export default app
