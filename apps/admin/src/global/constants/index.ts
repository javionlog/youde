export const STORAGE_PREFIX = 'youde-'

export const THEME_MODES = ['light', 'dark'] as const

export const LANG_TYPES = ['en-us', 'zh-cn'] as const

export type LangType = (typeof LANG_TYPES)[number]

export type ThemeMode = (typeof THEME_MODES)[number]
