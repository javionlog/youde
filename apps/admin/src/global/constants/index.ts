export const STORAGE_PREFIX = 'youde-'

export interface LangItem {
  label: string
  value: string
}

export const LANG_OPTIONS = [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: '简体中文',
    value: 'zh-cn'
  }
] as const satisfies LangItem[]

export type LangValue = (typeof LANG_OPTIONS)[number]['value']
