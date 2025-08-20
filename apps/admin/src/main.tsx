import { createRoot } from 'react-dom/client'
import App from './app'
import { setApiConfig } from './global/config/api'
import 'tdesign-react/es/style/index.css'
import './global/styles/index.css'

setApiConfig()

const root = document.getElementById('root')!

createRoot(root).render(<App />)
