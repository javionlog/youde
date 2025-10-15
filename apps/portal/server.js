import compression from 'compression'
import { consola } from 'consola'
import express from 'express'
import morgan from 'morgan'

const serverEntry = './dist/server/index.js'
const port = Number(process.env.PORT ?? '3000')

const app = express()

app.use(compression())
app.disable('x-powered-by')

app.use('/assets', express.static('dist/client/assets', { immutable: true, maxAge: '1y' }))
app.use(morgan('tiny'))
app.use(express.static('dist/client', { maxAge: '1h' }))
app.use(await import(serverEntry).then(mod => mod.app))

app.listen(port, () => {
  consola.info(`Server is running on http://localhost:${port}`)
})
