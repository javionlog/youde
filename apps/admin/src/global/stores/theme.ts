import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

interface State {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create(
  persist(
    subscribeWithSelector<State>(set => {
      return {
        mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        setMode: mode => {
          set({ mode })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}theme`, storage: createJSONStorage(() => localStorage) }
  )
)
