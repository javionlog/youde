import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

interface State {
  lang: LangType
}

const getCurrentLang = () => {
  const lang = (navigator.language?.toLowerCase() ?? 'en-us') as LangType
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
