import type { ReactNode } from 'react'
import type { Route } from './+types/root'
import 'tdesign-mobile-react/es/style/index.css'
import './global/styles/index.css'
import { useTranslation } from 'react-i18next'
import { data } from 'react-router'
import { setApiConfig } from './global/config/api'
import { getLocale, i18nextMiddleware, localeCookie } from './global/middleware/i18next'

setApiConfig()

export const middleware = [i18nextMiddleware]

export const loader = async ({ context }: Route.LoaderArgs) => {
  const locale = getLocale(context)

  return data({ locale }, { headers: { 'Set-Cookie': await localeCookie.serialize(locale) } })
}

export const Layout = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation()

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

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
