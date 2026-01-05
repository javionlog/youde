import KeepAlive from 'keepalive-for-react'
import type { ReactNode } from 'react'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

const NavToSignIn = () => {
  const { pathname, search } = useLocation()
  const responseStatus = useHttpStore(state => state.responseStatus)

  useEffect(() => {
    useUserStore.setState({ user: null })
    useResourceStore.setState({ resourceTree: [] })
    useHttpStore.setState({ responseStatus: 0 })
  }, [responseStatus])

  const to = `/sign-in?redirect=${pathname}${search}`
  return <Navigate to={to} replace />
}

const ScrollToWrapper = (props: { children?: ReactNode }) => {
  const { children } = props
  const divRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const scrollHistoryMap = useRef<Map<string, number>>(new Map())

  const activeRoute = useMemo(() => {
    return location.pathname
  }, [location.pathname])

  useEffect(() => {
    const divDom = divRef.current
    if (!divDom) {
      return
    }
    divDom.scrollTo(0, scrollHistoryMap.current.get(activeRoute) ?? 0)
    const onScroll = (e: Event) => {
      const target = e.target as HTMLDivElement
      if (!target) return
      scrollHistoryMap.current.set(activeRoute, target?.scrollTop ?? 0)
    }
    divDom?.addEventListener('scroll', onScroll, {
      passive: true
    })
    return () => {
      divDom?.removeEventListener('scroll', onScroll)
    }
  }, [activeRoute])

  return (
    <div ref={divRef} className='flex h-dvh min-w-0 grow flex-col overflow-auto'>
      {children}
    </div>
  )
}

export const AppLayout = () => {
  const { t } = useTranslation()
  const outlet = useOutlet()
  const user = useUserStore(state => state.user)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const responseStatus = useHttpStore(state => state.responseStatus)
  const location = useLocation()
  const cachePaths = useTabStore(state => state.tabs).map(o => `/${o.path}`)

  const activeCacheKey = useMemo(() => {
    return location.pathname
  }, [location.pathname])

  useEffect(() => {
    useBasicDataStore.getState().setCountries()
    useTreasureStore.getState().setCategoryTree()
  }, [])

  useLocaleStore.subscribe(
    state => state.lang,
    lang => {
      useBasicDataStore.getState().setLocaleCountries(lang)
      useTreasureStore.getState().setLocaleCategoryTree(lang)
    }
  )

  const menus = [...layoutMenus, ...resourceTree]

  if (!user || responseStatus === 401) {
    return <NavToSignIn />
  }

  return (
    <>
      {
        <div className='app-layout flex'>
          <AppSidebar menus={menus} />
          <ScrollToWrapper>
            <AppHeader />
            <Suspense
              fallback={
                <div className='grid h-full items-center justify-center'>
                  {t('message.loading')}
                </div>
              }
            >
              <div className='grow rounded-lg bg-(--td-bg-color-container) p-5 sm:m-5'>
                <KeepAlive activeCacheKey={activeCacheKey} include={cachePaths}>
                  {outlet}
                </KeepAlive>
              </div>
            </Suspense>
          </ScrollToWrapper>
        </div>
      }
    </>
  )
}
