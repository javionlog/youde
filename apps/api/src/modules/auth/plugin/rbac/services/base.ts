import type { AuthContext } from 'better-auth'
import type { createAuthEndpoint } from 'better-auth/api'
import { parseCookies } from '../utils'

type EndpointContext = Parameters<Parameters<typeof createAuthEndpoint>[2]>[0] & {
  context: AuthContext
}

export const getSession = async (ctx: EndpointContext) => {
  const { headers, context, getSignedCookie } = ctx
  const { internalAdapter, secret } = context
  const cookieHeader = headers?.get('cookie')
  if (!cookieHeader) {
    return null
  }
  const cookies = Object.fromEntries(parseCookies(cookieHeader))
  const sessionTokens = (
    await Promise.all(
      Object.entries(cookies).map(async ([key]) => await getSignedCookie(key, secret))
    )
  ).filter(v => v !== null)
  if (!sessionTokens.length) {
    return null
  }
  const [session] = await internalAdapter.findSessions(sessionTokens)
  type Session = typeof session & { user: typeof session.user & { username: string } }
  return session as Session
}
