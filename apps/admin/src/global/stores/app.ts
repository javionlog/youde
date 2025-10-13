import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

interface State {
  themeMode: ThemeMode
  sidebarCollapsed: boolean
}

export const useAppStore = create(
  persist(
    subscribeWithSelector<State>(() => {
      return {
        themeMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        sidebarCollapsed: false
      }
    }),
    { name: `${STORAGE_PREFIX}app`, storage: createJSONStorage(() => localStorage) }
  )
)
