import { data } from 'react-router'
import { localeCookie } from '@/global/middleware/i18next'
import type { Route } from './+types/sync'

export async function action({ request }: Route.ActionArgs) {
  const body = (await request.json()) as { lang: LangType }
  const lang = body.lang.toLowerCase() as LangType

  return data(
    {},
    {
      headers: { 'Set-Cookie': await localeCookie.serialize(lang) }
    }
  )
}
