export {}

declare global {
  interface ImportMetaEnv {
    MODE: string
    DEV: boolean
    PROD: boolean
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_TRUSTED_ORIGINS: string
    DATABASE_URL: string
  }

  interface ImportMeta {
    readonly env: Readonly<ImportMetaEnv>
  }

  const __RUNTIME_ENV__: Readonly<ImportMetaEnv>
}
