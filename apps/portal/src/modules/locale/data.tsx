import { data } from 'react-router'
import resources from '@/global/locales'
import type { Route } from './+types/data'

export async function loader({ params }: Route.LoaderArgs) {
  const lang = params.lng.toLowerCase() as LangType
  const namespaces = params.ns as LangNamespace
  if (!LANG_TYPES.includes(lang)) {
    return data({ error: `${lang} not found` }, { status: 400 })
  }

  if (!LANG_NAMESPACES.includes(namespaces)) {
    return data({ error: `${namespaces} not found` }, { status: 400 })
  }

  return data(resources[lang][namespaces])
}
