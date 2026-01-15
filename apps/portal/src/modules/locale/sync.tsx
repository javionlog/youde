import { data } from 'react-router'
import { localeCookie } from '@/global/middleware/i18next'
import type { Route } from './+types/sync'

export async function loader({ params }: Route.LoaderArgs) {
  const lang = params.lng.toLowerCase() as LangType

  return data(
    {},
    {
      headers: { 'Set-Cookie': await localeCookie.serialize(lang) }
    }
  )
}
