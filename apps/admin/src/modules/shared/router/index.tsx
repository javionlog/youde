import Home from '@/modules/home'
import { Layout } from '@/modules/shared/layouts'
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
