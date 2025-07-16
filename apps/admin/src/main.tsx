import { createRoot } from 'react-dom/client'
import { setApiConfig } from './shared/config/api'
import { router } from './shared/router'
import 'tdesign-react/es/style/index.css'
import './shared/styles/index.css'

setApiConfig()

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
