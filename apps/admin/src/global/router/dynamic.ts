import { useResourceStore } from '@/global/stores'

const modules = import.meta.glob('../../modules/**/*.tsx')

export const genDynamicRoutes = () => {
  const pageResources = useResourceStore.getState().getPageResources()
  const routes = pageResources.map(item => {
    const componentUrl = `../../modules/${item.component ?? `${item.path}/index.tsx`}`

    return {
      path: item.path,
      Component: lazy(
        modules[componentUrl] as () => Promise<{
          default: React.ComponentType<any>
        }>
      )
    }
  })
  return routes
}
