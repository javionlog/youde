import { Elysia } from 'elysia'
import sharedPlugin from './global/plugins'
import auth from './modules/auth/controllers'
import category from './modules/category/controllers'
import categoryLocale from './modules/category-locale/controllers'
import guest from './modules/guest/controllers'
import thing from './modules/thing/controllers'

export const appController = new Elysia({ name: 'global.controller' })
  .use(sharedPlugin)
  .use(auth)
  .use(guest)
  .use(thing)
  .use(category)
  .use(categoryLocale)
