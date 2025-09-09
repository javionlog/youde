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
        <div className='app-layout flex h-full overflow-auto'>
          <AppSidebar menus={menus} />
          <div className='grow'>
            <AppHeader />
            <Suspense
              fallback={
                <div className='grid h-full items-center justify-center'>
                  {t('message.loading')}
                </div>
              }
            >
              <div className='p-5' style={{ height: 'calc(100dvh - var(--td-comp-size-xxxl))' }}>
                <div className='h-full overflow-auto rounded-lg bg-(--td-bg-color-container) p-5'>
                  <Outlet />
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      ) : (
        <div className='grid h-full items-center justify-center'>{t('message.initializing')}</div>
      )}
    </>
  )
}
