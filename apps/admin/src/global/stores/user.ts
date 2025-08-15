import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { User } from '@/global/api'
import { STORAGE_PREFIX } from '@/global/constants'

interface State {
  user: User | null
  setUser: (user: User | null) => void
}

export const useUserStore = create(
  persist<State>(
    set => {
      return {
        user: null,
        setUser: user => {
          set({ user })
        }
      }
    },
    { name: `${STORAGE_PREFIX}user`, storage: createJSONStorage(() => localStorage) }
  )
)
