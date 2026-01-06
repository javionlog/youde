import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import type { ResourceNode } from '@/global/api'

interface State {
  resourceTree: ResourceNode[]
  getResources: () => ResourceNode[]
  getMenuResources: () => ResourceNode[]
  getPageResources: () => ResourceNode[]
  getElementResources: () => ResourceNode[]
  checkResource: (name: string) => boolean
}

export const useResourceStore = create(
  persist(
    subscribeWithSelector<State>((_set, get) => {
      return {
        resourceTree: [],
        getResources: () => {
          const resourceTree = get().resourceTree
          return flattenTree(resourceTree)
        },
        getMenuResources: () => {
          return get()
            .getResources()
            .filter(o => o.type === 'Menu')
        },
        getPageResources: () => {
          return get()
            .getResources()
            .filter(o => o.type === 'Page')
        },
        getElementResources: () => {
          return get()
            .getResources()
            .filter(o => o.type === 'Element')
        },
        checkResource: name => {
          return get()
            .getElementResources()
            .some(o => o.name === name)
        }
      }
    }),
    { name: `${STORAGE_PREFIX}resource`, storage: createJSONStorage(() => localStorage) }
  )
)
