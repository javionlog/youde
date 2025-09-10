import { Elysia } from 'elysia'
import sharedPlugin from './global/plugins'
import article from './modules/article/controllers'
import auth from './modules/auth/controllers'

export const appController = new Elysia({ name: 'global.controller' })
  .use(sharedPlugin)
  .use(auth)
  .use(article)
