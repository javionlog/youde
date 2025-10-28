import { client } from '@/global/api/client.gen'

export const setApiConfig = () => {
  const baseUrl = isBrowser()
    ? '/api'
    : `http://${process.env.VITE_API_HOST_NAME}:${process.env.VITE_API_HOST_PORT}`
  client.setConfig({
    baseUrl
  })
}
