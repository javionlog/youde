import { LAYOUT_MENUS } from '@/global/router/static'
import { useResourceStore } from '@/global/stores'
import { SideBar } from './side-bar'

export const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const resourceTree = useResourceStore(state => state.resourceTree)
  const menus = [...LAYOUT_MENUS, ...resourceTree]

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true })
    }
  }, [])

  return (
    <div>
      <SideBar menus={menus} />
      <Suspense fallback={<div>Loading</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
