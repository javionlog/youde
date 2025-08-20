import { LAYOUT_MENUS } from '@/global/router/static'
import { useResourceStore } from '@/global/stores'
import { SideBar } from './side-bar'

export const Layout = () => {
  const resourceTree = useResourceStore(state => state.resourceTree)
  const menus = [...LAYOUT_MENUS, ...resourceTree]

  return (
    <div>
      <SideBar menus={menus} />
      <Suspense fallback={<div>Loading</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
