import type { RouteConfig } from '@react-router/dev/routes'
import { route } from '@react-router/dev/routes'

export const layoutRoutes = [
  {
    name: 'Home',
    path: '/',
    file: './modules/home/_index.tsx'
  },
  {
    name: 'Locale',
    path: '/locale/:lng/:ns',
    file: './modules/locale/data.tsx'
  },
  {
    name: 'Locale',
    path: '/locale-sync/:lng',
    file: './modules/locale/sync.tsx'
  }
] satisfies {
  name: string
  path: string
  file: string
}[]

export default [
  route(
    '/',
    './global/layouts/index.tsx',
    layoutRoutes.map(item => {
      return route(item.path, item.file)
    })
  )
] satisfies RouteConfig
