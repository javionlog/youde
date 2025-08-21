import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import type { ResourceNode } from '@/global/api'
import { postAuthRbacListUserResourceTree } from '@/global/api'
import { STORAGE_PREFIX } from '@/global/constants'
import { flattenTree } from '@/global/utils'
import { useUserStore } from './user'

interface State {
  resourceTree: ResourceNode[]
  getResources: () => ResourceNode[]
  getMenuResources: () => ResourceNode[]
  getPageResources: () => ResourceNode[]
  getElementResources: () => ResourceNode[]
  fetchResourceTree: () => Promise<void>
  setResourceTree: (resourceTree: ResourceNode[]) => void
}

export const useResourceStore = create(
  persist(
    subscribeWithSelector<State>((set, get) => {
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
        fetchResourceTree: async () => {
          const user = useUserStore.getState().user
          if (!user) {
            return
          }
          const resourceTree = await postAuthRbacListUserResourceTree({
            body: {
              userId: user.id!
            }
          }).then(r => r.data)
          set({ resourceTree })
        },
        setResourceTree: resourceTree => {
          set({ resourceTree })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}resource`, storage: createJSONStorage(() => localStorage) }
  )
)
