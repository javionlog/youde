export {}

declare global {
  interface ImportMetaEnv {
    MODE: string
    DEV: boolean
    PROD: boolean
    VITE_API_HOST: string
  }

  interface ImportMeta {
    readonly env: Readonly<ImportMetaEnv>
  }

  const __RUNTIME_ENV__: Readonly<ImportMetaEnv>
}
