export {}
declare module 'bun' {
  interface Env {
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_TRUSTED_ORIGINS: string
    DATABASE_URL: string
    SERVER_HOST_NAME: string
    SERVER_HOST_PORT: string
  }
}
