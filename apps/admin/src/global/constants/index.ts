export const STORAGE_PREFIX = 'youde-'

export const THEME_MODES = ['light', 'dark'] as const

export const LANG_TYPES = ['en-us', 'zh-cn'] as const

export const SCREEN_SIZE_MAP = {
  xs: [0, 512],
  sm: [512, 768],
  md: [768, 1024],
  lg: [1024, 1280],
  xl: [1280, 1536],
  '2xl': [1536, 1792]
} as const

export const SCREEN_SIZE_KEYS = Object.keys(SCREEN_SIZE_MAP)

export type LangType = (typeof LANG_TYPES)[number]

export type ThemeMode = (typeof THEME_MODES)[number]

export type ScreenSizeKey = keyof typeof SCREEN_SIZE_MAP
