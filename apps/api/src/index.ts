import { Hono } from 'hono'

const app = new Hono()

app.get('/hello', c => c.json({ msg: 'Hello' }))

export default app
