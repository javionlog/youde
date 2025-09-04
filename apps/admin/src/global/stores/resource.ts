import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import type { ResourceNode } from '@/global/api'
import { postAuthRbacListUserResourceTree } from '@/global/api'

interface State {
  resourceInited: boolean
  resourceTree: ResourceNode[]
  getResources: () => ResourceNode[]
  getMenuResources: () => ResourceNode[]
  getPageResources: () => ResourceNode[]
  getElementResources: () => ResourceNode[]
  fetchResourceTree: () => Promise<void>
}

export const useResourceStore = create(
  persist(
    subscribeWithSelector<State>((set, get) => {
      return {
        resourceInited: false,
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
          if (get().resourceInited) {
            return
          }
          const user = useUserStore.getState().user
          if (!user) {
            return
          }
          const resourceTree = await postAuthRbacListUserResourceTree({
            body: {
              userId: user.id
            }
          }).then(r => r.data)
          set({ resourceTree, resourceInited: true })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}resource`, storage: createJSONStorage(() => localStorage) }
  )
)
