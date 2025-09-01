import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { User } from '@/global/api'

interface State {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUserStore = create(
  persist(
    subscribeWithSelector<State>(set => {
      return {
        user: null,
        setUser: user => {
          set({ user })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}user`, storage: createJSONStorage(() => localStorage) }
  )
)
