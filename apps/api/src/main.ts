import { Hono } from 'hono'
import { auth } from './modules/auth'

const app = new Hono<{ Bindings: ImportMetaEnv }>()

app.all('/auth/*', async c => {
  const response = await auth(c.env).handler(c.req.raw)
  if (response.status === 404) {
    return c.text('404 Not Found', 404)
  }
  return response
})

export type AppType = typeof app

export default app
