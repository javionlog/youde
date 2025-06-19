import { createBrowserRouter } from 'react-router'
import { Layout } from '@/layouts'
import Home from '@/pages/home'
import Login from '@/pages/login'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'home',
        Component: Home
      },
      {
        path: 'login',
        Component: Login
      }
    ]
  }
])
