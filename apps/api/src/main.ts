import { OpenAPIHono } from '@hono/zod-openapi'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Scalar } from '@scalar/hono-api-reference'
import auth from './modules/auth'
import article from './modules/article'
import openapi from './modules/openapi'

const { VITE_SERVER_HOST_PORT, MODE } = import.meta.env

const app = new OpenAPIHono()

app.use('/public/*', serveStatic({ root: '/' }))

app.route('/', auth)
app.route('/', article)
app.route('/', openapi)
app.get(
  '/doc',
  Scalar({
    url: '/openapi',
    cdn: '/public/scalar/standalone.js'
  })
)

if (MODE === 'prod') {
  serve({
    fetch: app.fetch,
    port: Number(VITE_SERVER_HOST_PORT)
  })
}

export default app
