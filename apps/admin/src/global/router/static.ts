import type { RouteObject } from 'react-router'
import type { ResourceNode } from '@/global/api'

export const layoutMenus = [
  {
    id: 'home',
    name: 'Home',
    type: 'Page',
    path: 'home'
  }
] satisfies ResourceNode[]

export const noLayoutMenus = [
  {
    id: 'sign-in',
    name: 'Sign in',
    type: 'Page',
    path: 'sign-in'
  }
] satisfies ResourceNode[]

export const layoutRoutes = layoutMenus.map(item => {
  return {
    path: item.path,
    Component: lazy(() => import(`../../modules/${item.path}/index.tsx`))
  }
}) satisfies RouteObject[]

export const noLayoutRoutes = noLayoutMenus.map(item => {
  return {
    path: item.path,
    Component: lazy(() => import(`../../modules/${item.path}/index.tsx`))
  }
}) satisfies RouteObject[]
