import { layoutMenus } from '@/global/router'
import { useHttpStore, useResourceStore, useUserStore } from '@/global/stores'
import { SideBar } from './side-bar'

const NavToSignIn = () => {
  const { pathname, search } = useLocation()
  const responseStatus = useHttpStore(state => state.responseStatus)

  useEffect(() => {
    useUserStore.setState({ user: null })
    useResourceStore.setState({ resourceTree: [], resourceInited: false })
    useHttpStore.setState({ responseStatus: 0 })
  }, [responseStatus])

  const to = `/sign-in?redirect=${pathname}${search}`
  return <Navigate to={to} replace />
}

export const Layout = () => {
  const user = useUserStore(state => state.user)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const resourceInited = useResourceStore(state => state.resourceInited)
  const responseStatus = useHttpStore(state => state.responseStatus)
  const { fetchResourceTree } = useResourceStore()
  const menus = [...layoutMenus, ...resourceTree]

  useEffect(() => {
    fetchResourceTree()
  }, [])

  if (!user || responseStatus === 401) {
    return <NavToSignIn />
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
