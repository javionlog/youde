import { Elysia } from 'elysia'
import { ip } from 'elysia-ip'
import { ADMIN_SKIP_AUTH_ROUTES } from '@/global/config'
import { deleteSession, getSession } from '@/modules/admin/session/services'
import type { RowType as SessionRowType } from '@/modules/admin/session/specs'
import { getUser } from '@/modules/admin/user/services'
import type { RowType as UserRowType } from '@/modules/admin/user/specs'

export const baseController = new Elysia({ name: 'shared.baseController' })

export const adminGuardController = new Elysia({
  name: 'shared.adminGuardController',
  prefix: '/admin'
})
  .use(ip())
  .resolve(async ({ status, cookie, path, request }) => {
    const skipRoute = ADMIN_SKIP_AUTH_ROUTES.find(item => {
      return (
        item.url === path &&
        (item.method === 'nolimit' ? true : item.method === request.method.toLowerCase())
      )
    })
    if (skipRoute) {
      return {
        user: {
          username: '',
          password: '',
          enabled: true,
          isAdmin: false,
          id: '',
          createdAt: null,
          updatedAt: null,
          createdBy: null,
          updatedBy: null
        },
        session: {
          expiresAt: '',
          token: '',
          ipAddress: null,
          userAgent: null,
          username: null,
          userId: '',
          id: '',
          createdAt: null,
          updatedAt: null,
          createdBy: null,
          updatedBy: null
        }
      } satisfies {
        user: UserRowType
        session: SessionRowType
      }
    }
    const token = String(cookie.sessionToken.value ?? '')
    if (!token) {
      return status(401)
    }
    let session = null
    try {
      session = await getSession({ token })
      if (!session) {
        return status(401)
      }
    } catch {
      cookie.sessionToken.remove()
      return status(401)
    }
    if (new Date().toISOString() > session.expiresAt) {
      await deleteSession({ token })
      cookie.sessionToken.remove()
      return status(401)
    }
    const user = await getUser({ id: session.userId })
    return {
      user,
      session
    }
  })
