import { createBrowserRouter } from 'react-router'
import { Layout } from '@/shared/layouts'
import Home from '@/modules/home'
import SignIn from '@/modules/sign-in'

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
        path: 'sign-in',
        Component: SignIn
      }
    ]
  }
])
