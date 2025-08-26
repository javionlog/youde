import { createRoot } from 'react-dom/client'
import './global/locales'
import App from './app'
import { setApiConfig } from './global/config/api'
import 'tdesign-react/es/_util/react-19-adapter'
import 'tdesign-react/es/style/index.css'
import './global/styles/index.css'

setApiConfig()

const root = document.getElementById('root')!

createRoot(root).render(<App />)
