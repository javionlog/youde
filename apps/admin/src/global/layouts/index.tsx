import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

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

export const AppLayout = () => {
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
        <div className='h-full flex'>
          <AppSidebar menus={menus} />
          <div className='flex grow-1 flex-col'>
            <AppHeader />
            <Suspense
              fallback={<div className='h-full grid justify-center items-center'>Loading...</div>}
            >
              <div className='grow-1 p-5'>
                <div className='h-full bg-(--td-bg-color-container) p-5'>
                  <Outlet />
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      ) : (
        <div className='h-full grid justify-center items-center'>Initializing...</div>
      )}
    </>
  )
}
