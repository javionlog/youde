import i18n from 'i18next'
import type { HttpBackendOptions } from 'i18next-http-backend'
import backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(backend)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    debug: import.meta.env.PROD ? false : true,
    ns: ['global'],
    lng: useLocaleStore.getState().lang,
    supportedLngs: ['en-us', 'zh-cn'],
    lowerCaseLng: true,
    fallbackLng: 'en-us',
    defaultNS: 'global',
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  })

export { default as i18n } from 'i18next'
