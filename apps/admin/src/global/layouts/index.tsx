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
  const { t } = useTranslation()
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
        <div className='app-layout flex'>
          <AppSidebar menus={menus} />
          <div className='flex h-dvh min-w-0 grow flex-col overflow-auto'>
            <AppHeader />
            <Suspense
              fallback={
                <div className='grid h-full items-center justify-center'>
                  {t('message.loading')}
                </div>
              }
            >
              <div className='mt-5 grow rounded-lg bg-(--td-bg-color-container) p-5 sm:m-5'>
                <Outlet />
              </div>
            </Suspense>
          </div>
        </div>
      ) : (
        <div className='grid h-dvh items-center justify-center'>{t('message.initializing')}</div>
      )}
    </>
  )
}
