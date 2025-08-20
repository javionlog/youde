import { Navigate } from 'react-router'
import { Layout } from '@/global/layouts'
import { genDynamicRoutes } from './dynamic'
import { LAYOUT_ROUTES, NO_LAYOUT_ROUTES } from './static'

export * from './dynamic'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: '/',
        element: <Navigate to='/home' replace />
      },
      ...LAYOUT_ROUTES,
      ...genDynamicRoutes()
    ]
  },
  ...NO_LAYOUT_ROUTES
])
