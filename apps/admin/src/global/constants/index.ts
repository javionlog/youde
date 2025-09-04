export const STORAGE_PREFIX = 'youde-'

export const THEME_MODES = ['light', 'dark'] as const

export const LANG_TYPES = ['en-us', 'zh-cn'] as const

export const SCREEN_SIZE_MAP = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export const SCREEN_SIZE_KEYS = Object.keys(SCREEN_SIZE_MAP) as (keyof typeof SCREEN_SIZE_MAP)[]

export const SCREEN_SIZE_VALUES = Object.values(SCREEN_SIZE_MAP)

export type LangType = (typeof LANG_TYPES)[number]

export type ThemeMode = (typeof THEME_MODES)[number]

export type ScreenSizeKeys = typeof SCREEN_SIZE_KEYS

export type ScreenSizeValues = typeof SCREEN_SIZE_VALUES
