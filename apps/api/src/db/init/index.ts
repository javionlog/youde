import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { auth } from '@/modules/auth/services'

const { api } = auth

const reset = async () => {
  const tableSchema = db._.schema
  if (!tableSchema) {
    return
  }
  const queries = Object.values(tableSchema).map(table => {
    return sql.raw(`TRUNCATE TABLE public.${table.dbName} CASCADE;`)
  })

  await Promise.all(
    queries.map(async query => {
      if (query) {
        return await db.execute(query)
      }
    })
  )
}

const init = async () => {
  const userRes = (await api.signUpEmail({
    body: {
      name: 'admin',
      username: 'admin',
      email: 'admin@example.com',
      password: '12345678'
    }
  }))!
  const roleRes = (await api.createRole({
    body: {
      name: 'Super Admin',
      enabled: true
    }
  }))!
  const resourceRes1 = (await api.createResource({
    body: {
      name: 'Auth Management',
      type: 'Menu',
      enabled: true,
      isShow: true,
      sort: 0
    }
  }))!
  const resourceRes2 = (await api.createResource({
    body: {
      parentId: resourceRes1?.id,
      name: 'User Management',
      type: 'Page',
      path: 'auth/user',
      sort: 1,
      enabled: true,
      isCache: true,
      isShow: true
    }
  }))!
  const resourceRes3 = (await api.createResource({
    body: {
      parentId: resourceRes1?.id,
      name: 'Role Management',
      type: 'Page',
      path: 'auth/role',
      sort: 2,
      enabled: true,
      isCache: true,
      isShow: true
    }
  }))!
  const resourceRes4 = (await api.createResource({
    body: {
      parentId: resourceRes1?.id,
      name: 'Resource Management',
      type: 'Page',
      path: 'auth/resource',
      sort: 3,
      enabled: true,
      isCache: true,
      isShow: true
    }
  }))!
  const resourceIds = [resourceRes1.id, resourceRes2.id, resourceRes3.id, resourceRes4.id]
  const roleIds = [roleRes.id]
  for (const id of resourceIds) {
    await api.createRoleResourceRelation({
      body: {
        roleId: roleRes.id,
        resourceId: id
      }
    })
  }
  for (const id of roleIds) {
    await api.createUserRoleRelation({
      body: {
        userId: userRes.user.id,
        roleId: id
      }
    })
  }
}

await reset()
await init()
