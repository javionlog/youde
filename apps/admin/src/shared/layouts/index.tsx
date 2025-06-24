import { Outlet, NavLink, useLocation, useNavigate } from 'react-router'
import { Space } from 'tdesign-react'

export const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home', { replace: true })
    }
  }, [location])

  const menus = [
    {
      path: '/home',
      text: 'Home'
    },
    {
      path: '/sign-in',
      text: 'Sign In'
    }
  ]

  return (
    <div>
      <Space>
        {menus.map(menu => {
          return (
            <NavLink key={menu.path} to={menu.path}>
              {menu.text}
            </NavLink>
          )
        })}
      </Space>
      <Outlet />
    </div>
  )
}
