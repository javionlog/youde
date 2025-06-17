import { BetterAuthOptions } from 'better-auth'
import { openAPI, username } from 'better-auth/plugins'

export const betterAuthOptions: BetterAuthOptions = {
  basePath: '/auth',
  plugins: [openAPI(), username()]
}
