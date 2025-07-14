import { OpenAPIHono } from '@hono/zod-openapi'
import mainApp from '@/main'
import { auth } from '@/modules/auth'

const app = new OpenAPIHono()

app.get('/openapi', async c => {
  const commonDoc = mainApp.getOpenAPI31Document({
    openapi: '3.1.0',
    info: {
      title: 'API Doc',
      version: '1.0.0'
    }
  })
  const authDoc = await auth.api.generateOpenAPISchema()
  return c.json({
    ...commonDoc,
    components: {
      ...commonDoc.components,
      schemas: {
        ...commonDoc.components?.schemas,
        ...authDoc.components.schemas
      }
    },
    paths: {
      ...commonDoc.paths,
      ...authDoc.paths
    }
  })
})

export default app
