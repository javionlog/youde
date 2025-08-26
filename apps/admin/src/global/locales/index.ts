import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import type { HttpBackendOptions } from 'i18next-http-backend'
import backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { useLocaleStore } from '@/global/stores'

i18n
  .use(backend)
  .use(detector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    debug: import.meta.env.PROD ? false : true,
    ns: ['global'],
    lng: useLocaleStore.getState().lang,
    lowerCaseLng: true,
    fallbackLng: 'en',
    defaultNS: 'global',
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  })

export default i18n
