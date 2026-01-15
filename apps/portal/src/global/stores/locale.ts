import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { LangType } from '../constants'

interface State {
  lang: LangType
}

const getCurrentLang = () => {
  const detector = new I18nextBrowserLanguageDetector()
  const lang = detector.detect(['htmlTag']) as LangType
  const langMap = {
    zh: 'zh-cn',
    'zh-cn': 'zh-cn',
    en: 'en-us',
    'en-us': 'en-us'
  } as const

  return langMap[lang]
}

export const useLocaleStore = create(
  persist(
    subscribeWithSelector<State>(() => {
      return {
        lang: getCurrentLang()
      }
    }),
    { name: `${STORAGE_PREFIX}locale`, storage: createJSONStorage(() => localStorage) }
  )
)
