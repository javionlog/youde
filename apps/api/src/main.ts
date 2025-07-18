import { Elysia } from 'elysia'
import article from './modules/article'
import auth from './modules/auth'
import plugins from './shared/plugins'

const app = new Elysia().use(plugins).use(article).use(auth)

export type App = typeof app

export default {
  ...app,
  port: 8787
}
