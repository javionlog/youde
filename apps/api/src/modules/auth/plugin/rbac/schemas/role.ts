import type { BetterAuthPlugin } from 'better-auth/plugins'
import { baseFields } from './base'

export const roleSchema = {
  role: {
    fields: {
      ...baseFields
    }
  }
} satisfies BetterAuthPlugin['schema']
