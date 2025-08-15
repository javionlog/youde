import { useResourceStore } from '@/global/stores'

export const genDynamicRoutes = () => {
  const pageResources = useResourceStore.getState().getPageResources()
  const routes = pageResources.map(item => {
    return {
      path: item.path,
      Component: lazy(
        () => import(/* @vite-ignore */ `../../modules/${item.component ?? `${item.path}`}`)
      )
    }
  })
  return routes
}
