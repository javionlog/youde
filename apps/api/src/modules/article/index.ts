import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

const ParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: 'id',
        in: 'path'
      },
      example: '123'
    })
})

const ArticleSchema = z
  .object({
    id: z.string().openapi({
      example: '123'
    }),
    title: z.string().openapi({
      example: 'Hello world'
    }),
    createdAt: z.string().openapi({
      example: '2025-02-22'
    })
  })
  .openapi('Article')

const route = createRoute({
  method: 'get',
  path: '/article/{id}',
  tags: ['Article'],
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ArticleSchema
        }
      },
      description: 'Get Article'
    }
  }
})

app.openapi(route, async c => {
  const { id } = c.req.valid('param')
  return c.json({ id, title: 'Best news', createdAt: '2025-01-11' }, 200)
})

export default app
