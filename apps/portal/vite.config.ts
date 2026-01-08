import { fileURLToPath } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { resolveModuleExportNames } from 'mlly'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import babel from 'vite-plugin-babel'
import tsconfigPaths from 'vite-tsconfig-paths'

const curDir = fileURLToPath(new URL('.', import.meta.url))

const componentNames = (await resolveModuleExportNames('tdesign-mobile-react/es/index.js')).filter(
  v => {
    return !/^[a-z]*$/.test(v)
  }
)

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, curDir, 'VITE_')
  const { VITE_API_HOST_NAME, VITE_API_HOST_PORT } = env

  return {
    plugins: [
      tailwindcss(),
      reactRouter(),
      babel({
        filter: /\.[jt]sx?$/,
        babelConfig: {
          presets: ['@babel/preset-typescript'],
          plugins: [['babel-plugin-react-compiler', {}]]
        }
      }),
      tsconfigPaths(),
      AutoImport({
        imports: [
          {
            from: 'react',
            imports: [
              'Activity',
              'createElement',
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
              'useState',
              'useImperativeHandle'
            ]
          },
          {
            from: 'react-router',
            imports: [
              'Navigate',
              'Links',
              'Meta',
              'Outlet',
              'Scripts',
              'ScrollRestoration',
              'isRouteErrorResponse',
              'useNavigate',
              'useLocation'
            ]
          },
          {
            from: 'es-toolkit',
            imports: ['isNil', 'isBrowser', 'camelCase', 'uniq', 'uniqBy']
          },
          {
            from: 'react-i18next',
            imports: ['useTranslation']
          },
          {
            from: 'ahooks',
            imports: ['useSize', 'useGetState']
          },
          {
            from: 'tdesign-mobile-react',
            imports: componentNames
          }
        ],
        dirs: ['./src/global/utils/index.ts', './src/global/constants/index.ts'],
        dts: 'types/auto-imports.d.ts'
      })
    ],
    server: {
      host: 'localhost',
      port: 9000,
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
    ssr: {
      noExternal: isSsrBuild ? true : undefined
    },
    build: {
      rolldownOptions: {
        input: isSsrBuild ? './server/app.ts' : undefined,
        output: {
          advancedChunks: {
            maxSize: 1024 * 100,
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
                name: 'date-fns',
                test: /node_modules\/date-fns/,
                priority: 2
              },
              {
                name: 'tdesign-mobile-react',
                test: /node_modules\/tdesign-mobile-react/,
                priority: 2,
                maxSize: Infinity
              },
              {
                name: 'tdesign-icons-react',
                test: /node_modules\/tdesign-icons-react/,
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
