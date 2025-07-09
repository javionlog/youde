import { Hono } from 'hono'
import { auth } from './modules/auth'
import { serve, type HttpBindings } from '@hono/node-server'

const { VITE_SERVER_HOST_PORT, MODE } = import.meta.env

const app = new Hono<{ Bindings: HttpBindings }>()

app.all('/auth/*', async c => {
  const response = await auth.handler(c.req.raw)
  if (response.status === 404) {
    return c.text('404 Not Found', 404)
  }
  return response
})

if (MODE === 'prod') {
  serve({
    fetch: app.fetch,
    port: Number(VITE_SERVER_HOST_PORT)
  })
}

export default app
