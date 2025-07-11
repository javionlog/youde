import ky from 'ky'

type ResponseResult = {
  code: string
  message: string
}

const http = ky.create({
  prefixUrl: '/api',
  timeout: 10000,
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
