import type { RouteObject } from 'react-router'
import type { ResourceNode } from '@/global/api'

export const LAYOUT_MENUS = [
  {
    id: 'home',
    name: 'Home',
    type: 'Page',
    path: 'home',
    isShow: true
  },
  {
    id: 'not-found',
    name: 'Not Found',
    type: 'Page',
    path: '*',
    isShow: false
  }
] as const satisfies ResourceNode[]

export const NO_LAYOUT_MENUS = [
  {
    id: 'sign-in',
    name: 'Sign in',
    type: 'Page',
    path: 'sign-in'
  }
] as const satisfies ResourceNode[]

export const LAYOUT_ROUTES = LAYOUT_MENUS.map(item => {
  if (item.id === 'not-found') {
    return {
      path: item.path,
      Component: lazy(() => import('../../global/error/not-found.tsx'))
    }
  }
  return {
    path: item.path,
    Component: lazy(() => import(`../../modules/${item.path}/index.tsx`))
  }
}) satisfies RouteObject[]

export const NO_LAYOUT_ROUTES = NO_LAYOUT_MENUS.map(item => {
  return {
    path: item.path,
    Component: lazy(() => import(`../../modules/${item.path}/index.tsx`))
  }
}) satisfies RouteObject[]
