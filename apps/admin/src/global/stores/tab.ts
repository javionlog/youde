import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'
import type { ResourceNode } from '@/global/api'
import { layoutMenus } from '@/global/router'

interface State {
  tabs: ResourceNode[]
  addTab: (tab: ResourceNode) => void
  deleteTab: (id: string) => void
  deleteLeftTabs: (index: number) => void
  deleteRightTabs: (index: number) => void
  deleteOtherTabs: (id: string) => void
  clearTabs: () => void
}

export const useTabStore = create(
  persist(
    subscribeWithSelector<State>((set, get) => {
      const initTab: ResourceNode[] = []
      const homeMenu = layoutMenus.find(o => o.id === 'home')
      if (homeMenu) {
        initTab.push(homeMenu)
      }
      return {
        tabs: initTab,
        addTab: (tab: ResourceNode) => {
          const tabs = get().tabs
          const index = tabs.findIndex(o => o.id === tab.id)
          if (index === -1) {
            set({ tabs: [...tabs, tab] })
          }
        },
        deleteTab: (id: string) => {
          const tabs = get().tabs.filter(o => {
            if (o.isAffix) {
              return true
            }
            return o.id !== id
          })
          set({ tabs })
        },
        deleteOtherTabs: (id: string) => {
          const tabs = get().tabs.filter(o => {
            if (o.isAffix) {
              return true
            }
            return o.id === id
          })
          set({ tabs })
        },
        deleteLeftTabs: (index: number) => {
          const tabs = get().tabs.filter((o, i) => {
            if (o.isAffix) {
              return true
            }
            return i >= index
          })
          set({ tabs })
        },
        deleteRightTabs: (index: number) => {
          const tabs = get().tabs.filter((o, i) => {
            if (o.isAffix) {
              return true
            }
            return i <= index
          })
          set({ tabs })
        },
        clearTabs: () => {
          const tabs = get().tabs.filter(o => {
            return o.isAffix
          })
          set({ tabs })
        }
      }
    }),
    { name: `${STORAGE_PREFIX}tab`, storage: createJSONStorage(() => localStorage) }
  )
)
