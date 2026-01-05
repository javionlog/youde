import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { TreasureCategoryNode } from '@/global/api'
import { postAdminTreasureCategoryTree } from '@/global/api'

type CategoryNode = TreasureCategoryNode & { label: string; value: string }

interface State {
  categoryTree: CategoryNode[]
  setCategoryTree: () => void
  setLocaleCategoryTree: (lang: LangType) => void
  getCategoryTree: () => CategoryNode[]
  getCategoryOptions: () => CategoryNode[]
  getCategoryName: (id: string) => string
}

export const useTreasureStore = create(
  subscribeWithSelector<State>((set, get) => {
    return {
      categoryTree: [],
      setCategoryTree: async () => {
        const lang = camelCase(useLocaleStore.getState().lang)

        const res = await postAdminTreasureCategoryTree({ body: {} })
        const tmpCategory = flattenTree(res.data ?? []).map(item => {
          const localeItem = item?.locales.find(o => o.field === 'name')
          return {
            ...item,
            label: localeItem?.[lang as 'enUs'] ?? item.name,
            value: item.id
          }
        })
        const categoryTree = buildTree(tmpCategory)
        set({ categoryTree })
      },
      setLocaleCategoryTree: lang => {
        const tmpCategory = get()
          .getCategoryOptions()
          .map(item => {
            const localeItem = item?.locales.find(o => o.field === 'name')
            return {
              ...item,
              label: localeItem?.[camelCase(lang) as 'enUs'] ?? item.name,
              value: item.id
            }
          })
        const categoryTree = buildTree(tmpCategory)
        set({ categoryTree })
      },
      getCategoryTree: () => {
        return get().categoryTree
      },
      getCategoryOptions: () => {
        return flattenTree(get().categoryTree)
      },
      getCategoryName: id => {
        const lang = camelCase(useLocaleStore.getState().lang)

        const categoryItem = get()
          .getCategoryOptions()
          .find(o => o.id === id)
        const localeItem = categoryItem?.locales.find(o => o.field === 'name')
        return localeItem?.[lang as 'enUs'] ?? id
      }
    }
  })
)
