import { OpenAPIHono } from '@hono/zod-openapi'
import mainApp from '@/main'
import { authInstance } from '@/modules/auth'

const app = new OpenAPIHono()

app.get('/openapi', async c => {
  const commonDoc = mainApp.getOpenAPI31Document({
    openapi: '3.1.0',
    info: {
      title: 'API Doc',
      version: '1.0.0'
    }
  })
  const authDoc = await authInstance.api.generateOpenAPISchema()
  const authDocPaths = Object.fromEntries(
    Object.entries(authDoc.paths).map(([k, v]) => {
      return [`/auth${k}`, v]
    })
  )
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
      ...authDocPaths
    }
  })
})

export default app
