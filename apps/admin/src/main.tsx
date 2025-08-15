import { createRoot } from 'react-dom/client'
import { setApiConfig } from './global/config/api'
import { router } from './global/router'
import 'tdesign-react/es/style/index.css'
import './global/styles/index.css'

setApiConfig()

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
