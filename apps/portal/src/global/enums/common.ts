import i18n from 'i18next'
import type { LangType, ThemeMode } from '../constants'

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
