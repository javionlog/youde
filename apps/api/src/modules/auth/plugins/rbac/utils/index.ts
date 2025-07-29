import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31
} from '@asteasolutions/zod-to-openapi'
import { type ZodType, z } from 'zod'

export const isEmpty = (val: unknown): val is undefined | null | string | unknown[] => {
  return (
    val === undefined ||
    val === null ||
    (typeof val === 'string' && val.trim() === '') ||
    (Array.isArray(val) && val.length === 0)
  )
}

extendZodWithOpenApi(z)
export const getOpenAPISchema = (schema: ZodType) => {
  const registry = new OpenAPIRegistry()
  registry.register('_Schema', schema)
  const components = new OpenApiGeneratorV31(registry.definitions).generateComponents()
  const result = components.components?.schemas?._Schema
  return result as any
}

export const parseCookies = (cookie: string) => {
  const result = []
  const cookies = cookie.split(';')
  for (const c of cookies) {
    const [key, value] = c.split('=')
    result.push([key.trim(), value.trim()])
  }
  return result
}
