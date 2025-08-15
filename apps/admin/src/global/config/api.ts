import { client } from '@/global/api/client.gen'

type ResponseResult = {
  code: string
  message: string
}

export const setApiConfig = () => {
  client.setConfig({
    baseUrl: '/api'
  })

  client.interceptors.request.use(req => {
    return req
  })

  client.interceptors.response.use(async res => {
    if (!res.ok) {
      let msg = res.statusText
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const result = (await res.json()) as ResponseResult
        if (result.message) {
          msg = result.message
        }
        MessagePlugin.error(msg)
        throw new Error(msg)
      } else {
        const text = await res.text()
        MessagePlugin.error(text)
        throw new Error(text)
      }
    }
    return res
  })
}
