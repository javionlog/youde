import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import backend from 'i18next-fetch-backend'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'
import { getInitialNamespaces } from 'remix-i18next/client'

const main = async () => {
  await i18next
    .use(initReactI18next)
    .use(backend)
    .use(I18nextBrowserLanguageDetector)
    .init({
      supportedLngs: LANG_TYPES,
      ns: getInitialNamespaces(),
      fallbackLng: FALLBACK_LANG,
      detection: { order: ['htmlTag'], caches: [] },
      backend: { loadPath: '/locale/{{lng}}/{{ns}}' },
      defaultNS: DEFAULT_LANG_NAMESPACE,
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
