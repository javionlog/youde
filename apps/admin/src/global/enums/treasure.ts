import type { GetAdminTreasureResponse } from '@/global/api'

export const TREASURE_FEE = [
  {
    get label() {
      return i18n.t('treasure.enum.fee.free', { ns: 'content', lng: i18n.language })
    },
    value: 'Free'
  },
  {
    get label() {
      return i18n.t('treasure.enum.fee.partlyFree', { ns: 'content', lng: i18n.language })
    },
    value: 'PartlyFree'
  },
  {
    get label() {
      return i18n.t('treasure.enum.fee.paid', { ns: 'content', lng: i18n.language })
    },
    value: 'Paid'
  }
] satisfies {
  label: string
  value: GetAdminTreasureResponse['fee']
}[]

export const TREASURE_STATUS = [
  {
    get label() {
      return i18n.t('treasure.enum.status.draft', { ns: 'content', lng: i18n.language })
    },
    value: 'Draft'
  },
  {
    get label() {
      return i18n.t('treasure.enum.status.pending', { ns: 'content', lng: i18n.language })
    },
    value: 'Pending'
  },
  {
    get label() {
      return i18n.t('treasure.enum.status.passed', { ns: 'content', lng: i18n.language })
    },
    value: 'Passed'
  }
] satisfies {
  label: string
  value: GetAdminTreasureResponse['status']
}[]
