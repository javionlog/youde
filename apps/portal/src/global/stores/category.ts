import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { TreasureCategoryNode } from '@/global/api'

interface State {
  tree: (TreasureCategoryNode & { label: string; value: string })[]
}

export const useCategoryStore = create(
  subscribeWithSelector<State>(() => {
    return {
      tree: []
    }
  })
)
