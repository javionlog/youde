import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { LangValue } from '@/global/constants'
import { STORAGE_PREFIX } from '@/global/constants'

interface State {
  lang: LangValue
  setLang: (lang: LangValue) => void
}

const getCurrentLang = () => {
  const lang = (navigator.language?.toLowerCase() ?? 'en-us') as LangValue
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
    subscribeWithSelector<State>(set => {
      return {
        lang: getCurrentLang(),
        setLang: lang => {
          set({ lang })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}locale`, storage: createJSONStorage(() => localStorage) }
  )
)
