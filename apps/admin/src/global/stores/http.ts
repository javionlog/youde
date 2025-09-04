import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

interface State {
  responseStatus: number
}

export const useHttpStore = create(
  persist(
    subscribeWithSelector<State>(() => {
      return {
        responseStatus: 0
      }
    }),
    { name: `${STORAGE_PREFIX}http`, storage: createJSONStorage(() => localStorage) }
  )
)
