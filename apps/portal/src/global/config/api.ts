import { client } from '@/global/api/client.gen'

export const setApiConfig = () => {
  client.setConfig({
    baseUrl: `${import.meta.env.VITE_API_HOST_NAME}:${import.meta.env.VITE_API_HOST_PORT}`
  })
}
