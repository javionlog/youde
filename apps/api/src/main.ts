import { Elysia } from 'elysia'
import { globalController } from './global/controllers'

const { SERVER_HOST_PORT } = process.env

const app = new Elysia().use(globalController)

export type App = typeof app

export default {
  ...app,
  port: Number(SERVER_HOST_PORT)
}
