import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { GetAdminCountryResponse } from '@/global/api'

interface State {
  counties: GetAdminCountryResponse[]
}

export const useBaseDataStore = create(
  subscribeWithSelector<State>(() => {
    return {
      counties: []
    }
  })
)
