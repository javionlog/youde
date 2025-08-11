export {}
declare module 'bun' {
  interface Env {
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    DATABASE_URL: string
  }
}
