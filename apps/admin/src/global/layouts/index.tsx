import { LAYOUT_MENUS } from '@/global/router/static'
import { useResourceStore, useUserStore } from '@/global/stores'
import { SideBar } from './side-bar'

export const Layout = () => {
  const { pathname, search } = useLocation()
  const user = useUserStore(state => state.user)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const menus = [...LAYOUT_MENUS, ...resourceTree]

  if (!user) {
    const to = `/sign-in?redirect=${pathname}${search}`
    return <Navigate to={to} replace />
  }
  return (
    <div>
      <SideBar menus={menus} />
      <Suspense fallback={<div>Loading</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
