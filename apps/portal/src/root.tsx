import type { ReactNode } from 'react'
import type { Route } from './+types/root'
import 'tdesign-mobile-react/es/style/index.css'
import './global/styles/index.css'
import { useTranslation } from 'react-i18next'
import { data, useLoaderData } from 'react-router'
import { ConfigProvider } from 'tdesign-mobile-react'
import enConfig from 'tdesign-mobile-react/es/locale/en_US'
import zhConfig from 'tdesign-mobile-react/es/locale/zh_CN'
import { setApiConfig } from './global/config/api'
import { getLocale, i18nextMiddleware, localeCookie } from './global/middleware/i18next'
import {
  getPreference,
  preferenceCookie,
  preferenceMiddleware
} from './global/middleware/preference'

setApiConfig()

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : (error.statusText ?? details)
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='p-4'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

export const middleware = [i18nextMiddleware, preferenceMiddleware]

export const loader = async ({ context }: Route.LoaderArgs) => {
  const preference = getPreference(context)

  const locale = getLocale(context)

  return data(
    { locale, preference },
    {
      headers: [
        ['Set-Cookie', await localeCookie.serialize(locale)],
        ['Set-Cookie', await preferenceCookie.serialize(preference)]
      ]
    }
  )
}

export const Layout = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation()
  const loaderData = useLoaderData<typeof loader>()
  const themeMode = useAppStore(state => state.themeMode)

  const langConfigMap = {
    'zh-cn': zhConfig,
    'en-us': enConfig
  }

  useEffect(() => {
    document.documentElement.setAttribute('theme-mode', themeMode)
  }, [themeMode])

  return (
    <html
      lang={i18n.language}
      dir={i18n.dir(i18n.language)}
      {...{ 'theme-mode': loaderData.preference.themeMode }}
    >
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <ConfigProvider globalConfig={langConfigMap[i18n.language as LangType]}>
          <div className='bg-(--td-bg-color-page) text-(--td-text-color-primary)'>{children}</div>
        </ConfigProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const App = ({ loaderData: { locale } }: Route.ComponentProps) => {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  return <Outlet />
}

export default App
