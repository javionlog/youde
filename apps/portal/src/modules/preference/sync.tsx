import { data } from 'react-router'
import type { Preference } from '@/global/middleware/preference'
import { preferenceCookie } from '@/global/middleware/preference'
import type { Route } from './+types/sync'

export async function action({ request }: Route.ActionArgs) {
  const body = (await request.json()) as Preference

  const preference = await preferenceCookie.serialize(body)
  return data(
    {},
    {
      headers: {
        'Set-Cookie': preference
      }
    }
  )
}
