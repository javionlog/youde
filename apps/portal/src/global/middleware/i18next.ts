import { initReactI18next } from 'react-i18next'
import { createI18nextMiddleware } from 'remix-i18next/middleware'
import resources from '@/global/locales'

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages: [...LANG_TYPES],
    fallbackLanguage: FALLBACK_LANG,
    async findLocale() {
      return await 'zh-cn'
    }
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
