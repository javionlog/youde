import { Outlet, NavLink, useLocation, useNavigate } from 'react-router'
import { useState } from 'react'
import { Space, Link } from 'tdesign-react'

export const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  if (location.pathname === '/') {
    navigate('/home', { replace: true })
  }
  const [count, setCount] = useState('0')
  const getHello = async () => {
    const res = (await fetch('/api/hello').then(res => res.json())) as { msg: string }
    setCount(() => res.msg)
  }
  getHello()

  const menus = [
    {
      path: '/home',
      text: 'Home'
    },
    {
      path: '/login',
      text: 'Login'
    }
  ]

  return (
    <div>
      <div>{count}</div>
      <Space>
        {menus.map(menu => {
          return (
            <NavLink key={menu.path} to={menu.path}>
              {({ isActive }) => (
                <Link theme={isActive ? 'primary' : 'default'} underline>
                  {menu.text}
                </Link>
              )}
            </NavLink>
          )
        })}
      </Space>
      <Outlet />
    </div>
  )
}
