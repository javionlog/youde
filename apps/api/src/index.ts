import { Hono } from 'hono'
import { auth } from './modules/auth/lib/better-auth'

const app = new Hono<{ Bindings: Cloudflare.Env }>()

app.get('/hello', c => c.json({ msg: 'Hello' }))

app.on(['GET', 'POST'], '/auth/*', c => {
  return auth(c.env).handler(c.req.raw)
})

export default app
