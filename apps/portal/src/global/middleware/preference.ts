import type { MiddlewareFunction, RouterContextProvider } from 'react-router'
import { createContext, createCookie } from 'react-router'

export type Preference = {
  themeMode: ThemeMode
}

const preferenceContext = createContext<Preference>()

export const preferenceCookie = createCookie('preference', {
  path: '/',
  sameSite: 'lax',
  secure: true,
  httpOnly: true
})

export const getPreference = (context: Readonly<RouterContextProvider>) => {
  return context.get(preferenceContext)
}

export const preferenceMiddleware: MiddlewareFunction = async ({ context, request }, next) => {
  const cookie = request.headers.get('Cookie')
  const preference: Preference = (await preferenceCookie.parse(cookie)) ?? {
    themeMode: 'light'
  }

  context.set(preferenceContext, preference)
  return await next()
}
