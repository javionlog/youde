import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { PostAdminTreasureCategoryTreeResponse } from '@/global/api'

interface State {
  categoryTree: PostAdminTreasureCategoryTreeResponse
}

export const useTreasureStore = create(
  subscribeWithSelector<State>(() => {
    return {
      categoryTree: []
    }
  })
)
