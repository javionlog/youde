import { Elysia } from 'elysia'
import sharedPlugin from './global/plugins'
import adminAuthResource from './modules/admin/auth/resource/controllers'
import adminAuthResourceLocale from './modules/admin/auth/resource-locale/controllers'
import adminAuthRole from './modules/admin/auth/role/controllers'
import adminAuthRoleResourceRelation from './modules/admin/auth/role-resource-relation/controllers'
import adminAuthUserRoleRelation from './modules/admin/auth/user-role-relation/controllers'
import adminCountry from './modules/admin/country/controllers'
import adminSession from './modules/admin/session/controllers'
import adminTreasure from './modules//admin/treasure/controllers'
import adminTreasureCategory from './modules/admin/treasure-category/controllers'
import adminTreasureCategoryLocale from './modules/admin/treasure-category-locale/controllers'
import adminUser from './modules/admin/user/controllers'
import portalCountry from './modules/portal/country/controllers'
import portalTreasure from './modules//portal/treasure/controllers'
import portalTreasureCategory from './modules/portal/treasure-category/controllers'
import portalTreasureCategoryLocale from './modules/portal/treasure-category-locale/controllers'

export const appController = new Elysia({ name: 'global.controller' })
  .use(sharedPlugin)
  .use(adminUser)
  .use(adminSession)
  .use(adminAuthRole)
  .use(adminAuthResource)
  .use(adminAuthResourceLocale)
  .use(adminAuthUserRoleRelation)
  .use(adminAuthRoleResourceRelation)
  .use(adminTreasureCategory)
  .use(adminTreasureCategoryLocale)
  .use(adminCountry)
  .use(adminTreasure)
  .use(portalCountry)
  .use(portalTreasure)
  .use(portalTreasureCategory)
  .use(portalTreasureCategoryLocale)
