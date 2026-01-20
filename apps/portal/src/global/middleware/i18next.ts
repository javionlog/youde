import { initReactI18next } from 'react-i18next'
import { createCookie } from 'react-router'
import { createI18nextMiddleware } from 'remix-i18next/middleware'
import resources from '@/global/locales'

const year = 60 * 60 * 24 * 365

export const localeCookie = createCookie('lng', {
  path: '/',
  sameSite: 'lax',
  secure: true,
  httpOnly: true,
  maxAge: year
})

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages: [...LANG_TYPES],
    fallbackLanguage: FALLBACK_LANG,
    cookie: localeCookie
  },
  i18next: { resources },
  plugins: [initReactI18next]
})

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: DefaultLangNamescpe
    resources: (typeof resources)['en-us']
  }
}
