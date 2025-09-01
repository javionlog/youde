import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

interface State {
  responseStatus: number
  setResponseStatus: (responseStatus: number) => void
}

export const useHttpStore = create(
  persist(
    subscribeWithSelector<State>(set => {
      return {
        responseStatus: 0,
        setResponseStatus: responseStatus => {
          set({ responseStatus })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}http`, storage: createJSONStorage(() => localStorage) }
  )
)
