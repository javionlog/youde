export const STORAGE_PREFIX = 'youde-'

export interface LangItem {
  label: string
  value: string
}

export const LANG_OPTIONS = [
  {
    label: 'English',
    value: 'en-us'
  },
  {
    label: '简体中文',
    value: 'zh-cn'
  }
] as const satisfies LangItem[]

export const THEME_MODE = ['light', 'dark', 'system'] as const

export type LangValue = (typeof LANG_OPTIONS)[number]['value']

export type ThemeMode = (typeof THEME_MODE)[number]
