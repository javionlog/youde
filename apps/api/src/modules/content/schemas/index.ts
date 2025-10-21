import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { thing } from '@/db/schemas/content'
import { dateJsonSpec, omitBodyFields } from '@/global/specs'

const statusSpec = {
  status: z.enum(['Pending', 'Passed', 'Rejected'])
}

export const insertSchema = createInsertSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({
  ...omitBodyFields,
  id: true,
  userId: true,
  status: true
})

export const deleteSchema = z.object({
  id: z.string()
})

export const updateSchema = createUpdateSchema(thing, dateJsonSpec).omit(omitBodyFields)

export const selectSchema = createSelectSchema(thing, dateJsonSpec).omit(omitBodyFields)

export const rowSchema = createSelectSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({})

export const listSchema = z.object({
  records: z.array(rowSchema),
  total: z.number()
})

export const promiseRowSchema = createSelectSchema(thing, {
  ...dateJsonSpec,
  ...statusSpec
}).omit({})

export const promiseListSchema = z.object({
  records: z.array(rowSchema),
  total: z.number()
})
