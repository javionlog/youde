import { Elysia } from 'elysia'
import { auth } from '@/modules/auth/service'

const { SERVER_HOST_NAME, SERVER_HOST_PORT } = process.env

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

const app = new Elysia({ name: 'shared.plugin.openapi' })
  .get(
    '/openapi',
    async () => {
      const mainSpec = await fetch(
        `http://${SERVER_HOST_NAME}:${SERVER_HOST_PORT}/scalar/json`
      ).then(r => r.json())
      const authSpec = await auth.api.generateOpenAPISchema()
      const authPaths = Object.fromEntries(
        Object.entries(authSpec.paths).map(([k, v]) => {
          if (v.get) {
            v.get.tags = ['Auth']
          }
          if (v.post) {
            v.post.tags = ['Auth']
          }
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
      return spec
    },
    {
      detail: {
        hide: true
      }
    }
  )
  .get(
    '/doc',
    async () => {
      const mainSpec = await fetch(
        `http://${SERVER_HOST_NAME}:${SERVER_HOST_PORT}/scalar/json`
      ).then(r => r.json())
      const authSpec = await auth.api.generateOpenAPISchema()
      const authPaths = Object.fromEntries(
        Object.entries(authSpec.paths).map(([k, v]) => {
          if (v.get) {
            v.get.tags = ['Auth']
          }
          if (v.post) {
            v.post.tags = ['Auth']
          }
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
