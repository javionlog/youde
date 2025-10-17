import type { TabBarProps } from 'tdesign-mobile-react'
import { layoutRoutes } from '@/routes'

export default () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [tabValue, setTabValue] = useState(location.pathname)

  const onTabChange: TabBarProps['onChange'] = value => {
    if (typeof value === 'string') {
      setTabValue(value)
      navigate(value)
    }
  }

  return (
    <div className='app-layout mx-auto max-w-lg'>
      <Outlet />
      <TabBar value={tabValue} onChange={onTabChange}>
        {layoutRoutes.map(item => {
          return (
            <TabBarItem key={item.path} icon={item.icon} value={item.path}>
              {item.name}
            </TabBarItem>
          )
        })}
      </TabBar>
    </div>
  )
}
