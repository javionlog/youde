import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from './schemas/auth'

const { DATABASE_URL } = process.env

export const db = drizzle({
  connection: {
    url: DATABASE_URL
  },
  schema
})
