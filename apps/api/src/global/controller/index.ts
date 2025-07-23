import { Elysia } from 'elysia'
import article from '@/modules/article/controller'
import auth from '@/modules/auth/controller'
import sharedPlugin from '@/modules/shared/plugin'

export const globalController = new Elysia({ name: 'global.controller' })
  .use(sharedPlugin)
  .use(auth)
  .use(article)
