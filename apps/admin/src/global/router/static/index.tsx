import type { RouteObject } from 'react-router'
import type { ResourceNode } from '@/global/api'

export const layoutMenus = [
  {
    id: 'home',
    name: 'Home',
    type: 'Page',
    path: 'home',
    icon: undefined,
    isShow: true,
    isAffix: true,
    locales: [
      {
        id: 'home',
        resourceId: 'home',
        field: 'name',
        enUs: 'Home',
        zhCn: '首页'
      }
    ]
  },
  {
    id: 'not-found',
    name: 'Not Found',
    type: 'Page',
    path: '*',
    icon: undefined,
    isShow: false,
    isAffix: false,
    locales: []
  },
  {
    id: 'layout-root',
    name: 'Layout Root',
    type: 'Page',
    path: '/',
    icon: undefined,
    isShow: false,
    isAffix: false,
    locales: []
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
      Component: lazy(() => import('./not-found.tsx'))
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
    Component: lazy(() => import(`../../../modules/${item.path}/_index.tsx`))
  }
}) satisfies RouteObject[]

export const noLayoutRoutes = noLayoutMenus.map(item => {
  return {
    id: item.id,
    path: item.path,
    Component: lazy(() => import(`../../../modules/${item.path}/_index.tsx`))
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
