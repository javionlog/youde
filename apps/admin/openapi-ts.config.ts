import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3000/openapi',
  output: {
    format: 'biome',
    lint: 'biome',
    path: './src/global/api'
  },
  parser: {
    filters: {
      operations: {
        include: ['/admin/']
      }
    }
  },
  plugins: [
    '@hey-api/schemas',
    {
      name: '@hey-api/client-fetch'
    },
    {
      dates: true,
      name: '@hey-api/transformers'
    },
    {
      enums: 'javascript',
      name: '@hey-api/typescript'
    },
    {
      name: '@hey-api/sdk',
      transformer: true
    }
  ]
})
