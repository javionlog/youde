import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { LangValue } from '@/global/constants'
import { STORAGE_PREFIX } from '@/global/constants'

interface State {
  lang?: LangValue
  setLang: (lang?: LangValue) => void
}

export const useLocaleStore = create(
  persist(
    subscribeWithSelector<State>(set => {
      return {
        lang: undefined,
        setLang: lang => {
          set({ lang })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}locale`, storage: createJSONStorage(() => localStorage) }
  )
)
