export {}

declare global {
  interface ImportMetaEnv {
    VITE_BETTER_AUTH_URL: string
    VITE_BETTER_AUTH_SECRET: string
    VITE_BETTER_AUTH_TRUSTED_ORIGINS: string
    VITE_DATABASE_URL: string
    VITE_SERVER_HOST_NAME: string
    VITE_SERVER_HOST_PORT: string
  }

  interface ImportMeta {
    readonly env: Readonly<ImportMetaEnv>
  }
}
