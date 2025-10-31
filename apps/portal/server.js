import compression from 'compression'
import { consola } from 'consola'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import morgan from 'morgan'

const serverEntry = './dist/server/index.js'
const port = Number(process.env.VITE_SERVER_HOST_PORT)

const app = express()

app.use(compression())
app.disable('x-powered-by')

app.use('/assets', express.static('dist/client/assets', { immutable: true, maxAge: '1y' }))
app.use(
  '/api',
  createProxyMiddleware({
    target: `http://${process.env.VITE_API_HOST_NAME}:${process.env.VITE_API_HOST_PORT}`,
    changeOrigin: true,
    pathRewrite: path => {
      return path.replace(/^\/api/, '')
    }
  })
)
app.use(morgan('tiny'))
app.use(express.static('dist/client', { maxAge: '1h' }))
app.use(await import(serverEntry).then(mod => mod.app))

app.listen(port, () => {
  consola.info(`Server is running on http://localhost:${port}`)
})
