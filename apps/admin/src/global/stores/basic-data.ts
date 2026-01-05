import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { GetAdminCountryResponse } from '@/global/api'
import { postAdminCountryList } from '@/global/api'
import type { LangType } from '../constants'

type Option = { label: string; value: string }

type CountryItem = GetAdminCountryResponse & Option

type CountryNode = Option & { children: CountryItem[] }

interface State {
  countries: CountryItem[]
  setCountries: () => void
  setLocaleCountries: (lang: LangType) => void
  getRegionOptions: () => Option[]
  getCountryOptions: (
    regions?: string[],
    option?: { label: keyof CountryItem; value: keyof CountryItem }
  ) => CountryItem[]
  getRegionCountryTree: () => CountryNode[]
  getCountryName: (code: string) => string
}

export const useBasicDataStore = create(
  subscribeWithSelector<State>((set, get) => {
    return {
      countries: [],
      setCountries: async () => {
        const lang = camelCase(useLocaleStore.getState().lang)

        const res = await postAdminCountryList({ body: {} })
        const countries = (res.data?.records ?? []).map(item => {
          return {
            ...item,
            label: item[lang as 'enUs'] ?? item.enUs,
            value: item.code
          }
        })
        set({ countries })
      },
      setLocaleCountries: lang => {
        const countries = get().countries.map(item => {
          return {
            ...item,
            label: item[camelCase(lang) as 'enUs'] ?? item.enUs
          }
        })
        set({ countries })
      },
      getRegionOptions() {
        const regions = uniq(get().countries.map(o => o.region))
          .map(val => {
            return {
              label: val,
              value: val
            }
          })
          .sort((a, b) => {
            return a.label.localeCompare(b.label)
          })
        return regions
      },
      getCountryOptions: (regions, option) => {
        const { label = 'label', value = 'value' } = option ?? {}

        return get()
          .countries.filter(item => {
            if (regions?.length) {
              return regions.includes(item.region)
            }
            return true
          })
          .map(item => {
            return {
              ...item,
              label: item[label] ?? item.label,
              value: item[value] ?? item.value
            }
          })
          .sort((a, b) => {
            if (a[label] && b[label]) {
              return a[label].localeCompare(b[label])
            }
            return 0
          })
      },
      getRegionCountryTree: () => {
        const countries = get().countries
        const regions = uniq(countries.map(o => o.region))
          .map(val => {
            return {
              label: val,
              value: val,
              children: [] as CountryItem[]
            }
          })
          .sort((a, b) => {
            return a.label.localeCompare(b.label)
          })
        for (const item of regions) {
          for (const country of countries) {
            if (country.region === item.value) {
              item.children.push(country)
            }
          }
        }
        return regions.map(item => {
          return {
            ...item,
            children: item.children.sort((a, b) => {
              return a.label.localeCompare(b.label)
            })
          }
        })
      },
      getCountryName: code => {
        const lang = camelCase(useLocaleStore.getState().lang)
        const countryItem = get().countries.find(o => o.code === code)
        return countryItem?.[lang as 'enUs'] ?? code
      }
    }
  })
)
