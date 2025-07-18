import { Elysia } from 'elysia'
import { authInstance } from '@/modules/auth'

const html = (content: object) => `<!doctype html>
<html>
  <head>
    <title>API Doc</title>
    <meta
        name="description"
        content="API documentation"
    />
    <meta
        name="og:description"
        content="API documentation"
    />
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script src="/public/scalar/standalone.js" crossorigin></script>
    <script>
      Scalar.createApiReference('#app', {
        content: ${JSON.stringify(content)}
      })
    </script>
  </body>
</html>`

const app = new Elysia().get(
  '/doc',
  async () => {
    const mainSpec = await fetch('http://localhost:8787/scalar/json').then((r) => r.json())
    const authSpec = await authInstance.api.generateOpenAPISchema()
    const authPaths = Object.fromEntries(
      Object.entries(authSpec.paths).map(([k, v]) => {
        return [`/auth${k}`, v]
      })
    )
    const spec = {
      ...mainSpec,
      components: {
        ...mainSpec.components,
        schemas: {
          ...mainSpec.components?.schemas,
          ...authSpec.components.schemas
        }
      },
      paths: {
        ...mainSpec.paths,
        ...authPaths
      }
    }
    const res = new Response(html(spec), {
      headers: {
        'content-type': 'text/html; charset=utf8'
      }
    })
    return res
  },
  {
    detail: {
      hide: true
    }
  }
)

export default app
