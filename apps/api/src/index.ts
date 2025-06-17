import { Hono } from 'hono'
import { auth } from './modules/auth/lib/better-auth'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/hello', c => c.json({ msg: 'Hello' }))

app.all('/auth/*', async c => {
  const response = await auth(c.env).handler(c.req.raw)
  if (response.status === 404) {
    return c.text('404 Not Found', 404)
  }
  return response
})

export default app
