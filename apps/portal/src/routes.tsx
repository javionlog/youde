import type { RouteConfig } from '@react-router/dev/routes'
import { route } from '@react-router/dev/routes'
import type { ReactNode } from 'react'
import { HomeIcon, UserIcon } from 'tdesign-icons-react'

export const layoutRoutes = [
  {
    name: '首页',
    path: '/',
    file: './modules/home/_index.tsx',
    icon: <HomeIcon />
  },
  {
    name: '我的',
    path: '/mine',
    file: './modules/mine/_index.tsx',
    icon: <UserIcon />
  }
] satisfies {
  name: string
  path: string
  file: string
  icon: ReactNode
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
