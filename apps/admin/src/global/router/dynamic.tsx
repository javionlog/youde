import { useResourceStore } from '@/global/stores'

const modules = import.meta.glob('../../modules/**/*.tsx')

export const genDynamicRoutes = () => {
  const pageResources = useResourceStore.getState().getPageResources()

  const routes = pageResources.map(item => {
    const finalPath = item.component ?? item.path
    const componentUrl = `../../modules/${finalPath}/index.tsx`

    return {
      id: item.id!,
      path: item.path!,
      Component: lazy(
        modules[componentUrl] as () => Promise<{
          default: React.ComponentType<any>
        }>
      )
    }
  })
  return routes
}
