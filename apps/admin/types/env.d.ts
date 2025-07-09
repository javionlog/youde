export {}

declare global {
  interface ImportMetaEnv {
    MODE: string
    DEV: boolean
    PROD: boolean
    VITE_API_HOST_NAME: string
    VITE_API_HOST_PORT: string
  }
  interface ImportMeta {
    readonly env: Readonly<ImportMetaEnv>
  }
}
