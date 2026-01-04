import { Elysia } from 'elysia'
import { z } from 'zod'
import {
  grantTreeResSpec as grantResourceNode,
  treeResSpec as resourceNode
} from '@/modules/admin/auth/resource/specs'
import { treeResSpec as treasureCategoryNode } from '@/modules/admin/treasure-category/specs'

z.globalRegistry.add(resourceNode, { id: 'ResourceNode' })
z.globalRegistry.add(grantResourceNode, { id: 'GrantResourceNode' })
z.globalRegistry.add(treasureCategoryNode, { id: 'TreasureCategoryNode' })

const getSpec = async () => {
  const mainSpec = await fetch(`http://localhost:3000/scalar/json`).then(r => r.json())
  const walkObj = (obj: any) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof obj[k] === 'object') {
        walkObj(v)
      } else {
        if (k === '$ref') {
          obj[k] = `#/components/schemas/${obj[k].split('/').pop()}`
        }
      }
    }
  }
  walkObj(mainSpec)
  const { paths, ...restSpec } = mainSpec
  Reflect.deleteProperty(paths, '/public/*')
  const { schemas } = z.toJSONSchema(z.globalRegistry, {
    uri: id => {
      return `#/components/schemas/${id}`
    }
  })
  const spec = {
    ...restSpec,
    paths,
    components: {
      schemas
    },
    openapi: '3.1.1',
    info: {
      title: 'Youde API Documentation',
      description: 'Youde API Documentation',
      version: '1.0.0'
    }
  }
  return spec
}

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
      return await getSpec()
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
      const spec = await getSpec()
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
