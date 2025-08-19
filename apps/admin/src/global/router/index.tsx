import { Layout } from '@/global/layouts'
import { genDynamicRoutes } from './dynamic'
import { LAYOUT_ROUTES, NO_LAYOUT_ROUTES } from './static'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [...LAYOUT_ROUTES, ...genDynamicRoutes()]
  },
  ...NO_LAYOUT_ROUTES
])
