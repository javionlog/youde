import Home from '@/modules/home'
import SignIn from '@/modules/sign-in'
import { Layout } from '@/shared/layouts'

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
