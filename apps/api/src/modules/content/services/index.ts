import { generateId } from 'better-auth'
import { count, eq } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '@/db'
import { thing } from '@/db/schemas/content'
import { throwDbError } from '@/global/errors'
import { convertDateValues } from '@/global/utils'
import type { insertSchema, rowSchema } from '../schemas'

export const createThing = async (
  params: z.infer<typeof insertSchema> & {
    userId: string
    username: string
  }
) => {
  try {
    const result = (
      await db
        .insert(thing)
        .values({
          ...params,
          id: generateId(),
          status: 'Pending',
          createdBy: params.username,
          updatedBy: params.username
        })
        .returning()
    )[0]
    return convertDateValues(result) as z.infer<typeof rowSchema>
  } catch (err) {
    return throwDbError(err)
  }
}

export const deleteThing = async (params: { id: string }) => {
  const { id } = params
  const row = (await db.delete(thing).where(eq(thing.id, id)).returning())[0]
  return row
}

export const listThing = async () => {
  const records = (await db.query.thing.findMany()).map(convertDateValues) as z.infer<
    typeof rowSchema
  >[]
  const total = await db.select({ total: count() }).from(thing)
  return {
    ...total[0],
    records
  }
}
