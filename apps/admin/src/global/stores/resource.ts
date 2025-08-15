import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ResourceNode } from '@/global/api'
import { postAuthRbacListUserResourceTree } from '@/global/api'
import { flattenTree } from '@/global/utils'
import { useUserStore } from './user'

interface State {
  isInited: boolean
  resourceTree: ResourceNode[]
  getResources: () => ResourceNode[]
  getMenuResources: () => ResourceNode[]
  getPageResources: () => ResourceNode[]
  getElementResources: () => ResourceNode[]
  fetchResourceTree: () => void
  setResourceTree: (resourceTree: ResourceNode[]) => void
}

export const useResourceStore = create(
  persist<State>(
    (set, get) => {
      return {
        isInited: false,
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
          set({ isInited: true })
        },
        setResourceTree: resourceTree => {
          set({ resourceTree })
        }
      }
    },
    { name: 'resource', storage: createJSONStorage(() => localStorage) }
  )
)
