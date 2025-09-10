import { Elysia } from 'elysia'
import { appController } from './app-controller'

const app = new Elysia().use(appController)

export type App = typeof app

export default {
  ...app,
  port: 3000
}
