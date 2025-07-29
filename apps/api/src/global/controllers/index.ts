import { Elysia } from 'elysia'
import article from '@/modules/article/controllers'
import auth from '@/modules/auth/controllers'
import sharedPlugin from '@/modules/shared/plugins'

export const globalController = new Elysia({ name: 'global.controller' })
  .use(sharedPlugin)
  .use(auth)
  .use(article)
