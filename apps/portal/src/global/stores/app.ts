import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { ThemeMode } from '../constants'

interface State {
  themeMode: ThemeMode
}

export const useAppStore = create(
  persist(
    subscribeWithSelector<State>(() => {
      return {
        themeMode: 'light'
      }
    }),
    { name: `${STORAGE_PREFIX}app`, storage: createJSONStorage(() => localStorage) }
  )
)
