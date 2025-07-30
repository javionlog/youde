import type { FieldAttribute } from 'better-auth/db'

export type ExtendAuthPluginSchema = {
  [table in string]: {
    fields: {
      [field in string]: FieldAttribute & { enum?: string[] }
    }
    disableMigration?: boolean
    modelName?: string
  }
}
