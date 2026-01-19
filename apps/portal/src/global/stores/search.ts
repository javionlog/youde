import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface State {
  value: string
}

export const useSearchStore = create(
  subscribeWithSelector<State>(() => {
    return {
      value: ''
    }
  })
)
