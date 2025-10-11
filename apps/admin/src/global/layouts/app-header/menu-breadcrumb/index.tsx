import { AppIcon } from 'tdesign-icons-react'
import type { BreadcrumbProps } from 'tdesign-react'

export const MenuBreadcrumb = () => {
  const location = useLocation()
  const resources = useResourceStore.getState().getResources()
  const allResources = [...layoutMenus, ...resources]
  const lang = camelCase(useLocaleStore(state => state.lang))

  const options = useMemo((): BreadcrumbProps['options'] => {
    const activeResourceItem = allResources.find(o => `/${o.path}` === location.pathname)
    if (!activeResourceItem) {
      return []
    }
    return [...getParentNodes(allResources, activeResourceItem?.id), activeResourceItem].map(
      item => {
        const menuLocale = item.locales?.find(o => o.field === 'name')
        const menuName = menuLocale?.[lang as 'enUs'] ?? item.name
        const icon = item.icon ? createElement(item.icon!) : <AppIcon key={item.id} />

        return {
          icon,
          content: menuName
        }
      }
    )
  }, [location, lang])

  return <Breadcrumb options={options} />
}
