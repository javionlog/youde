import type { RouteObject } from 'react-router'
import type { ResourceNode } from '@/global/api'

export const layoutMenus = [
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
  },
  {
    id: 'layout-root',
    name: 'Layout Root',
    type: 'Page',
    path: '/',
    isShow: false
  }
] as const satisfies ResourceNode[]

export const noLayoutMenus = [
  {
    id: 'sign-in',
    name: 'Sign in',
    type: 'Page',
    path: 'sign-in'
  }
] as const satisfies ResourceNode[]

export const layoutRoutes = layoutMenus.map(item => {
  if (item.id === 'not-found') {
    return {
      id: item.id,
      path: item.path,
      Component: lazy(() => import('../components/not-found/index.tsx'))
    }
  }
  if (item.id === 'layout-root') {
    return {
      id: item.id,
      path: item.path,
      element: <Navigate to='/home' replace />
    }
  }
  return {
    id: item.id,
    path: item.path,
    Component: lazy(() => import(`../../modules/${item.path}/index.tsx`))
  }
}) satisfies RouteObject[]

export const noLayoutRoutes = noLayoutMenus.map(item => {
  return {
    id: item.id,
    path: item.path,
    Component: lazy(() => import(`../../modules/${item.path}/index.tsx`))
  }
}) satisfies RouteObject[]

export const defaultRoutes = [
  {
    path: '/',
    Component: Layout,
    children: layoutRoutes
  },
  ...noLayoutRoutes
]
