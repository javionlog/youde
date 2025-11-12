import { Elysia } from 'elysia'
import { ADMIN_SKIP_AUTH_ROUTES, SKIP_AUTH_ROUTES } from '@/global/config'
import { deleteAdminSession, getAdminSession } from '@/modules/admin/session/services'
import { getAdminUser } from '@/modules/admin/user/services'
import { auth } from '@/modules/auth/services'

export const baseController = new Elysia({ name: 'shared.baseController' })

export const guardController = new Elysia({ name: 'shared.guardController' }).resolve(
  async ({ status, request, path }) => {
    if (SKIP_AUTH_ROUTES.includes(path) || path.startsWith('/guest')) {
      return
    }
    const { headers } = request
    const session = await auth.api.getSession({ headers })
    if (!session) {
      return status(401)
    }
    return {
      user: session.user,
      session: session.session
    }
  }
)

export const adminGuardController = new Elysia({
  name: 'shared.adminGuardController',
  prefix: '/admin'
}).resolve(async ({ status, cookie, path, request }) => {
  if (
    ADMIN_SKIP_AUTH_ROUTES.find(item => {
      return (
        item.url === path &&
        (item.method === 'nolimit' ? true : item.method === request.method.toLowerCase())
      )
    })
  ) {
    return
  }
  const token = String(cookie.sessionToken.value ?? '')
  if (!token) {
    return status(401)
  }
  const session = await getAdminSession({ token })
  if (!session) {
    return status(401)
  }
  if (new Date().toISOString() > session.expiresAt) {
    await deleteAdminSession({ token })
    cookie.sessionToken.remove()
    return status(401)
  }
  const user = await getAdminUser({ id: session.userId })
  return {
    user,
    session
  }
})
