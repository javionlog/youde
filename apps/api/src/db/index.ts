import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schemas/auth'

const { DATABASE_URL } = process.env

const sql = neon(DATABASE_URL)

export const db = drizzle(sql, { schema })
