import { createRoot } from 'react-dom/client'
import { setApiConfig } from './modules/shared/config/api'
import { router } from './modules/shared/router'
import 'tdesign-react/es/style/index.css'
import './shared/styles/index.css'

setApiConfig()

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
