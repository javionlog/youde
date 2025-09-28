import type { ResourceNode } from '@/global/api'

export const RESOURCE_TYPE = [
  {
    get label() {
      return i18n.t('resource.enum.type.menu', { ns: 'auth', lng: i18n.language })
    },
    value: 'Menu'
  },
  {
    get label() {
      return i18n.t('resource.enum.type.page', { ns: 'auth', lng: i18n.language })
    },
    value: 'Page'
  },
  {
    get label() {
      return i18n.t('resource.enum.type.element', { ns: 'auth', lng: i18n.language })
    },
    value: 'Element'
  }
] satisfies {
  label: string
  value: ResourceNode['type']
}[]
