import i18n from 'i18next'
import type { LangType, ThemeMode } from '../constants'

type EnumOption = {
  label: string
  value: string
}

export const THEME_MODE = [
  {
    get label() {
      return i18n.t('enum.themeMode.light')
    },
    value: 'light'
  },
  {
    get label() {
      return i18n.t('enum.themeMode.dark')
    },
    value: 'dark'
  }
] satisfies {
  label: string
  value: ThemeMode
}[]

export const LANG_OPTION = [
  {
    get label() {
      return 'English'
    },
    value: 'en-us'
  },
  {
    get label() {
      return '简体中文'
    },
    value: 'zh-cn'
  }
] satisfies {
  label: string
  value: LangType
}[]

export const FEE = [
  {
    get label() {
      return i18n.t('enum.fee.free')
    },
    value: 'Free' as const
  },
  {
    get label() {
      return i18n.t('enum.fee.partlyFree')
    },
    value: 'PartlyFree' as const
  },
  {
    get label() {
      return i18n.t('enum.fee.paid')
    },
    value: 'Paid' as const
  }
] satisfies EnumOption[]

export type FeeValue = (typeof FEE)[number]['value']
