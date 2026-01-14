import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import backend from 'i18next-fetch-backend'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'

const main = async () => {
  await i18next
    .use(initReactI18next)
    .use(backend)
    .use(I18nextBrowserLanguageDetector)
    .init({
      ns: ['global'],
      fallbackLng: 'en-us',
      detection: { order: ['htmlTag'], caches: [] },
      backend: { loadPath: '/locale/{{lng}}/{{ns}}' },
      defaultNS: 'global',
      lowerCaseLng: true
    })

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      </I18nextProvider>
    )
  })
}

main()
