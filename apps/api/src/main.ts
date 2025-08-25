import { Elysia } from 'elysia'
import { globalController } from './global/controllers/global'

const app = new Elysia().use(globalController)

export type App = typeof app

export default {
  ...app,
  port: 3000
}
