import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { ThemeMode } from '../constants'

interface State {
  themeMode: ThemeMode
}

const getDefaultThemeMode = () => {
  let result = 'light'
  if (isBrowser()) {
    result = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return result as ThemeMode
}

export const useAppStore = create(
  persist(
    subscribeWithSelector<State>(() => {
      return {
        themeMode: getDefaultThemeMode()
      }
    }),
    { name: `${STORAGE_PREFIX}app`, storage: createJSONStorage(() => localStorage) }
  )
)
