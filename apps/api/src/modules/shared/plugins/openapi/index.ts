import { Elysia } from 'elysia'
import { auth } from '@/modules/auth/services'

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
      const mainSpec = await fetch(`http://localhost:3000/scalar/json`).then(r => r.json())
      const authSpec = await auth.api.generateOpenAPISchema()
      const authPaths = Object.fromEntries(
        Object.entries(authSpec.paths).map(([k, v]) => {
          if (v.get) {
            if (v.get.tags?.includes('Default')) {
              v.get.tags = ['Auth']
            }
          }
          if (v.post) {
            if (v.post.tags?.includes('Default')) {
              v.post.tags = ['Auth']
            }
          }
          return [`/auth${k}`, v]
        })
      )
      const authSchemas = authSpec.components.schemas as any
      const spec = {
        ...mainSpec,
        components: {
          ...mainSpec.components,
          schemas: {
            ...mainSpec.components?.schemas,
            ...authSchemas,
            ResourceNode: {
              ...authSchemas.Resource,
              properties: {
                ...authSchemas.Resource?.properties,
                children: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ResourceNode'
                  }
                }
              }
            }
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
      const mainSpec = await fetch(`http://localhost:3000/scalar/json`).then(r => r.json())
      const authSpec = await auth.api.generateOpenAPISchema()
      const authPaths = Object.fromEntries(
        Object.entries(authSpec.paths).map(([k, v]) => {
          if (v.get) {
            if (v.get.tags?.includes('Default')) {
              v.get.tags = ['Auth']
            }
          }
          if (v.post) {
            if (v.post.tags?.includes('Default')) {
              v.post.tags = ['Auth']
            }
          }
          return [`/auth${k}`, v]
        })
      )
      const authSchemas = authSpec.components.schemas as any
      const spec = {
        ...mainSpec,
        components: {
          ...mainSpec.components,
          schemas: {
            ...mainSpec.components?.schemas,
            ...authSchemas,
            ResourceNode: {
              ...authSchemas.Resource,
              properties: {
                ...authSchemas.Resource?.properties,
                children: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ResourceNode'
                  }
                }
              }
            }
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
