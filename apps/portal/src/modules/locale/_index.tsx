import { data } from 'react-router'
import { z } from 'zod'
import resources from '@/global/locales'
import type { Route } from './+types/_index'

export async function loader({ params }: Route.LoaderArgs) {
  const lang = z.enum(Object.keys(resources) as Array<keyof typeof resources>).safeParse(params.lng)

  if (lang.error) return data({ error: lang.error }, { status: 400 })

  const namespaces = resources[lang.data]

  const ns = z.enum(Object.keys(namespaces) as Array<keyof typeof namespaces>).safeParse(params.ns)

  if (ns.error) return data({ error: ns.error }, { status: 400 })

  return data(namespaces[ns.data])
}
