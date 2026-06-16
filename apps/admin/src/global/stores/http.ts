import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface State {
  pendingRedirect: string | null
}

export const useHttpStore = create(
  subscribeWithSelector<State>(() => {
    return {
      pendingRedirect: null
    }
  })
)
