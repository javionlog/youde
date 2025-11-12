import { drizzle } from 'drizzle-orm/postgres-js'
import * as adminSchema from './schemas/admin'
import * as commonSchema from './schemas/common'
import * as portalSchema from './schemas/portal'

const { DATABASE_URL } = process.env

export const db = drizzle({
  connection: {
    url: DATABASE_URL
  },
  schema: {
    ...adminSchema,
    ...commonSchema,
    ...portalSchema
  }
})
