import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3000/openapi',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/modules/shared/api'
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
