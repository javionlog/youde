import { initReactI18next } from 'react-i18next'
import { createCookie } from 'react-router'
import { createI18nextMiddleware } from 'remix-i18next/middleware'
import resources from '@/global/locales'

export const localeCoolie = createCookie('lang', {
  path: '/',
  sameSite: 'lax',
  secure: true,
  httpOnly: true
})

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages: ['en-us', 'zh-cn'],
    fallbackLanguage: 'en-us',
    cookie: localeCoolie
  },
  i18next: { resources },
  plugins: [initReactI18next]
})

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'global'
    resources: (typeof resources)['en-us']
  }
}
