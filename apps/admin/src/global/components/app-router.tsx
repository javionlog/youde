import type { RouteObject } from 'react-router'
import type { GlobalConfigProvider } from 'tdesign-react'
import { ConfigProvider } from 'tdesign-react'
import enConfig from 'tdesign-react/es/locale/en_US'
import zhConfig from 'tdesign-react/es/locale/zh_CN'
import { Layout } from '@/global/layouts'
import { defaultRoutes, genDynamicRoutes, layoutRoutes, noLayoutRoutes } from '@/global/router'
import { useLocaleStore, useResourceStore } from '@/global/stores'

export default () => {
  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const resourceTree = useResourceStore(state => state.resourceTree)
  const element = useRoutes(routes)
  const lang = useLocaleStore.getState().lang

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
        Component: Layout,
        children: [...layoutRoutes, ...genDynamicRoutes()]
      },
      ...noLayoutRoutes
    ])
  }, [resourceTree])

  return <ConfigProvider globalConfig={globalConfig}>{element}</ConfigProvider>
}
