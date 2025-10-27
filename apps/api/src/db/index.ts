import { drizzle } from 'drizzle-orm/postgres-js'

import * as authSchema from './schemas/auth'
import * as thingSchema from './schemas/thing'

const { DATABASE_URL } = process.env

export const db = drizzle({
  connection: {
    url: DATABASE_URL
  },
  schema: {
    ...authSchema,
    ...thingSchema
  }
})
