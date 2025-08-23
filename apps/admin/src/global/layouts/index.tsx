import { layoutMenus } from '@/global/router'
import { useResourceStore, useUserStore } from '@/global/stores'
import { SideBar } from './side-bar'

export const Layout = () => {
  const { pathname, search } = useLocation()
  const user = useUserStore(state => state.user)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const resourceInited = useResourceStore(state => state.resourceInited)
  const { fetchResourceTree } = useResourceStore()
  const menus = [...layoutMenus, ...resourceTree]

  useEffect(() => {
    fetchResourceTree()
  }, [])

  if (!user) {
    const to = `/sign-in?redirect=${pathname}${search}`
    return <Navigate to={to} replace />
  }

  return (
    <>
      {resourceInited ? (
        <div>
          <SideBar menus={menus} />
          <Suspense fallback={<div>Loading</div>}>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        <div>Initializing</div>
      )}
    </>
  )
}
