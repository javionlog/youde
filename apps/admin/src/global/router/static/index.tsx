import type { RouteObject } from 'react-router'
import type { ResourceNode } from '@/global/api'

const commonFields = {
  createdAt: null,
  updatedAt: null,
  createdBy: null,
  updatedBy: null
}

export const layoutMenus = [
  {
    ...commonFields,
    id: 'home',
    name: 'Home',
    type: 'Page',
    path: 'home',
    sort: 1,
    parentId: null,
    activePath: null,
    component: null,
    icon: null,
    remark: null,
    enabled: true,
    isShow: true,
    isCache: true,
    isAffix: true,
    isLink: false,
    children: [],
    locales: [
      {
        ...commonFields,
        id: 'home',
        resourceId: 'home',
        field: 'name',
        enUs: 'Home',
        zhCn: '首页'
      }
    ]
  },
  {
    ...commonFields,
    id: 'not-found',
    name: 'Not Found',
    type: 'Page',
    path: '*',
    sort: 1,
    parentId: null,
    activePath: null,
    component: null,
    icon: null,
    remark: null,
    enabled: false,
    isShow: false,
    isCache: false,
    isAffix: false,
    isLink: false,
    children: [],
    locales: []
  },
  {
    ...commonFields,
    id: 'layout-root',
    name: 'Layout Root',
    type: 'Page',
    path: '/',
    sort: 1,
    parentId: null,
    activePath: null,
    component: null,
    icon: null,
    remark: null,
    enabled: false,
    isShow: false,
    isCache: false,
    isAffix: false,
    isLink: false,
    children: [],
    locales: []
  }
] as const satisfies ResourceNode[]

export const noLayoutMenus = [
  {
    ...commonFields,
    id: 'sign-in',
    name: 'Sign in',
    type: 'Page',
    path: 'sign-in',
    sort: 1,
    parentId: null,
    activePath: null,
    component: null,
    icon: null,
    remark: null,
    enabled: false,
    isShow: false,
    isCache: false,
    isAffix: false,
    isLink: false,
    children: [],
    locales: []
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
