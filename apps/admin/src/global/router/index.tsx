import { Layout } from '@/global/layouts'
import { genDynamicRoutes } from './dynamic'
import { layoutRoutes, noLayoutRoutes } from './static'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [...layoutRoutes, ...genDynamicRoutes()]
  },
  ...noLayoutRoutes
])
