import ky from 'ky'
import { MessagePlugin } from 'tdesign-react'

type ResponseResult = {
  code: string
  message: string
}

const http = ky.create({
  prefixUrl: '/api',
  timeout: 5000,
  headers: {
    'content-type': 'application/json'
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let msg = response.statusText
          try {
            const result = await response.json<ResponseResult>()
            if (result.message) {
              msg = result.message
            }
          } finally {
            MessagePlugin.error(msg)
          }
          throw new Error(msg)
        }
        return response
      }
    ]
  }
})

export default http
