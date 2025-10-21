import { drizzle } from 'drizzle-orm/postgres-js'

import * as authSchema from './schemas/auth'
import * as contentSchema from './schemas/content'

const { DATABASE_URL } = process.env

export const db = drizzle({
  connection: {
    url: DATABASE_URL
  },
  schema: {
    ...authSchema,
    ...contentSchema
  }
})
