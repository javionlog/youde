import type { ResourceNode } from '@/global/api'

export const RESOURCE_TYPE = [
  {
    label: i18n.t('resource.enum.type.menu', { ns: 'auth' }),
    value: 'Menu'
  },
  {
    label: i18n.t('resource.enum.type.page', { ns: 'auth' }),
    value: 'Page'
  },
  {
    label: i18n.t('resource.enum.type.element', { ns: 'auth' }),
    value: 'Element'
  }
] satisfies {
  label: string
  value: ResourceNode['type']
}[]
