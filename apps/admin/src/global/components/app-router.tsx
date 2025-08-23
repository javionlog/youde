import type { RouteObject } from 'react-router'
import { Layout } from '@/global/layouts'
import { defaultRoutes, genDynamicRoutes, layoutRoutes, noLayoutRoutes } from '@/global/router'
import { useResourceStore } from '@/global/stores'

export default () => {
  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const element = useRoutes(routes)

  useEffect(() => {
    return setRoutes([
      {
        path: '/',
        Component: Layout,
        children: [...layoutRoutes, ...genDynamicRoutes()]
      },
      ...noLayoutRoutes
    ])
  }, [resourceTree])

  return element
}
