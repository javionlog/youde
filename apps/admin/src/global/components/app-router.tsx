import type { RouteObject } from 'react-router'
import type { GlobalConfigProvider } from 'tdesign-react'
import { ConfigProvider } from 'tdesign-react'
import enConfig from 'tdesign-react/es/locale/en_US'
import zhConfig from 'tdesign-react/es/locale/zh_CN'

export const AppRouter = () => {
  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const element = useRoutes(routes)
  const lang = useLocaleStore.getState().lang
  const themeMode = useThemeStore(state => state.mode)

  const langConfigMap = {
    'zh-cn': zhConfig,
    'en-us': enConfig
  }
  const [globalConfig, setGlobalConfig] = useState<GlobalConfigProvider>(langConfigMap[lang])

  useEffect(() => {
    useLocaleStore.subscribe(
      state => state.lang,
      lang => {
        setGlobalConfig(langConfigMap[lang])
      }
    )

    return setRoutes([
      {
        path: '/',
        Component: AppLayout,
        children: [...layoutRoutes, ...genDynamicRoutes()]
      },
      ...noLayoutRoutes
    ])
  }, [resourceTree])

  useEffect(() => {
    document.documentElement.setAttribute('theme-mode', themeMode)
  }, [themeMode])

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <div className='bg-white dark:bg-black text-black dark:text-white min-h-screen'>
        {element}
      </div>
    </ConfigProvider>
  )
}
