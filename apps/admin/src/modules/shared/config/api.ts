import { client } from '@/modules/shared/api/client.gen'

type ResponseResult = {
  code: string
  message: string
}

export const setApiConfig = () => {
  client.setConfig({
    baseUrl: '/api'
  })

  client.interceptors.request.use((req) => {
    return req
  })

  client.interceptors.response.use(async (res) => {
    if (!res.ok) {
      let msg = res.statusText
      try {
        const result = (await res.json()) as ResponseResult
        if (result.message) {
          msg = result.message
        }
      } finally {
        MessagePlugin.error(msg)
      }
      throw new Error(msg)
    }
    return res
  })
}
