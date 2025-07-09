import { createRoot } from 'react-dom/client'
import { router } from './shared/router'
import 'tdesign-react/es/style/index.css'
import './shared/styles/index.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
