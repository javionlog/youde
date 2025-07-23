import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { authInstance } from '@/modules/auth/service'

const { SERVER_HOST_NAME, SERVER_HOST_PORT } = process.env

const reset = async () => {
  const tableSchema = db._.schema
  if (!tableSchema) {
    return
  }
  const queries = Object.values(tableSchema).map((table) => {
    return sql.raw(`TRUNCATE TABLE public.${table.dbName} CASCADE;`)
  })

  await Promise.all(
    queries.map(async (query) => {
      if (query) {
        return await db.execute(query)
      }
    })
  )
}

const init = async () => {
  await authInstance.api.signUpEmail({
    body: {
      name: 'admin',
      username: 'admin',
      email: 'admin@example.com',
      password: '12345678'
    }
  })
}

console.log('db init start')
await reset()
await init()
console.log('db init end')
