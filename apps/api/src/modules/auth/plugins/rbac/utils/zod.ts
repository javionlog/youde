import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31
} from '@asteasolutions/zod-to-openapi'
import type { FieldAttribute } from 'better-auth/db'
import { type ZodType, z } from 'zod'

extendZodWithOpenApi(z)
export const getOpenAPISchema = (schema: ZodType) => {
  const registry = new OpenAPIRegistry()
  registry.register('_Schema', schema)
  const components = new OpenApiGeneratorV31(registry.definitions).generateComponents()
  const result = components.components?.schemas?._Schema
  return result as any
}

type FieldAttributeToSchema<
  Field extends FieldAttribute | Record<string, never>,
  // if it's client side, then field attributes of `input` that are false should be removed
  isClientSide extends boolean = false
> = Field extends { type: any }
  ? GetInput<isClientSide, Field, GetRequired<Field, GetType<Field>>>
  : Record<string, never>

type GetType<F extends FieldAttribute> = F extends { type: 'string'; enum: string[] }
  ? z.ZodEnum<{
      [k in F['enum'][number]]: F['enum'][number]
    }>
  : F extends {
        type: 'string'
      }
    ? z.ZodString
    : F extends { type: 'number' }
      ? z.ZodNumber
      : F extends { type: 'boolean' }
        ? z.ZodBoolean
        : F extends { type: 'date' }
          ? z.ZodDate
          : z.ZodAny

type GetRequired<F extends FieldAttribute, Schema extends z.core.SomeType> = F extends {
  required: true
}
  ? Schema
  : z.ZodOptional<Schema>

type GetInput<
  isClientSide extends boolean,
  Field extends FieldAttribute,
  Schema extends z.core.SomeType
> = Field extends {
  input: false
}
  ? isClientSide extends true
    ? never
    : Schema
  : Schema

type RemoveNeverProps<T> = {
  [K in keyof T as [T[K]] extends [never] ? never : K]: T[K]
}

export function getZodSchema<
  Fields extends Record<string, (FieldAttribute & { enum?: string[] }) | never>,
  IsClientSide extends boolean
>({
  fields,
  isClientSide
}: {
  fields: Fields
  /**
   * If true, then any fields that have `input: false` will be removed from the schema to prevent user input.
   */
  isClientSide: IsClientSide
}) {
  const zodFields = Object.keys(fields).reduce(
    (
      acc: {
        [k: string]: ZodType
      },
      key
    ) => {
      const field = fields[key]
      if (!field) {
        return acc
      }
      if (isClientSide && field.input === false) {
        return acc
      }
      if (field.type === 'string[]' || field.type === 'number[]') {
        acc[key] = z.array(field.type === 'string[]' ? z.string() : z.number())
        return acc
      }
      if (field.type === 'string' && field.enum) {
        acc[key] = z.enum(field.enum)
        return acc
      }
      if (Array.isArray(field.type)) {
        acc[key] = z.any()
        return acc
      }
      let schema: ZodType = z[field.type]()
      if (field?.required === false) {
        schema = schema.optional()
      }
      if (field?.returned === false) {
        return acc
      }
      acc[key] = schema
      return acc
    },
    {}
  )
  const schema = z.object(zodFields)
  return schema as z.ZodObject<
    RemoveNeverProps<{
      [key in keyof Fields]: FieldAttributeToSchema<Fields[key], IsClientSide>
    }>,
    z.core.$strip
  >
}
