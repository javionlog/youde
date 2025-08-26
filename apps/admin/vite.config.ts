import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const curDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, curDir, 'VITE_')
  const { VITE_API_HOST_NAME, VITE_API_HOST_PORT } = env
  return {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      AutoImport({
        imports: [
          {
            from: 'react',
            imports: [
              'createContext',
              'lazy',
              'memo',
              'StrictMode',
              'Suspense',
              'useContext',
              'useCallback',
              'useEffect',
              'useMemo',
              'useReducer',
              'useRef',
              'useState'
            ]
          },
          {
            from: 'react-router',
            imports: [
              'Await',
              'Navigate',
              'RouterProvider',
              'BrowserRouter',
              'Outlet',
              'NavLink',
              'createBrowserRouter',
              'useHref',
              'useInRouterContext',
              'useLocation',
              'useNavigate',
              'useNavigationType',
              'useOutlet',
              'useOutletContext',
              'useParams',
              'useResolvedPath',
              'useRoutes'
            ]
          }
        ],
        packagePresets: [
          {
            package: 'tdesign-react',
            ignore: [/^[a-z]*$/]
          }
        ],
        dirs: ['./src/global/utils/index.ts'],
        dts: 'types/auto-imports.d.ts'
      })
    ],
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/api': {
          target: `http://${VITE_API_HOST_NAME}:${Number(VITE_API_HOST_PORT)}`,
          changeOrigin: true,
          rewrite: path => {
            return path.replace(/^\/api/, '')
          }
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'vendor',
                test: /node_modules/,
                priority: 1
              },
              {
                name: 'react',
                test: /node_modules\/react/,
                priority: 2
              },
              {
                name: 'ahooks',
                test: /node_modules\/ahooks/,
                priority: 2
              },
              {
                name: 'es-toolkit',
                test: /node_modules\/es-toolkit/,
                priority: 2
              },
              {
                name: 'tdesign-react',
                test: /node_modules\/tdesign-react/,
                priority: 2
              },
              {
                name: 'react-dom',
                test: /node_modules\/react-dom/,
                priority: 3
              },
              {
                name: 'react-router',
                test: /node_modules\/react-router/,
                priority: 3
              }
            ]
          }
        }
      }
    }
  }
})
