import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { User } from '@/global/api'

interface State {
  user: User | null
}

export const useUserStore = create(
  persist(
    subscribeWithSelector<State>(() => {
      return {
        user: null
      }
    }),
    { name: `${STORAGE_PREFIX}user`, storage: createJSONStorage(() => localStorage) }
  )
)
