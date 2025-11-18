import { Elysia } from 'elysia'
import sharedPlugin from './global/plugins'
import adminAuthResource from './modules/admin/auth/resource/controllers'
import adminAuthResourceLocale from './modules/admin/auth/resource-locale/controllers'
import adminAuthRole from './modules/admin/auth/role/controllers'
import adminAuthRoleResourceRelation from './modules/admin/auth/role-resource-relation/controllers'
import adminAuthUserRoleRelation from './modules/admin/auth/user-role-relation/controllers'
import adminSession from './modules/admin/session/controllers'
import adminUser from './modules/admin/user/controllers'
import category from './modules/common/category/controllers'
import categoryLocale from './modules/common/category-locale/controllers'
import country from './modules/common/country/controllers'
import thing from './modules/common/thing/controllers'

export const appController = new Elysia({ name: 'global.controller' })
  .use(sharedPlugin)
  .use(adminUser)
  .use(adminSession)
  .use(adminAuthRole)
  .use(adminAuthResource)
  .use(adminAuthResourceLocale)
  .use(adminAuthUserRoleRelation)
  .use(adminAuthRoleResourceRelation)
  .use(category)
  .use(categoryLocale)
  .use(country)
  .use(thing)
