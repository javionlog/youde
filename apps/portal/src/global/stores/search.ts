import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { PostPortalTreasureListData } from '@/global/api'

interface State {
  value: PostPortalTreasureListData['body']
}

export const useSearchStore = create(
  subscribeWithSelector<State>(() => {
    return {
      value: {}
    }
  })
)
