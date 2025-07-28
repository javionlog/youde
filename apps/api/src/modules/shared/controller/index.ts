import { Elysia } from 'elysia'
import { SKIP_AUTH_ROUTES } from '@/global/config'
import { auth } from '@/modules/auth/service'

export const baseController = new Elysia({ name: 'shared.baseController' })

export const guardController = new Elysia({ name: 'shared.guardController' }).resolve(
  async ({ status, request, path }) => {
    if (SKIP_AUTH_ROUTES.includes(path)) {
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
