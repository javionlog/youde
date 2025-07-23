import { Elysia } from 'elysia'
import { authInstance } from '@/modules/auth/service'

export const baseController = new Elysia({ name: 'shared.baseController' })

export const guardController = new Elysia({ name: 'shared.guardController' }).resolve(
  async ({ status, request: { headers } }) => {
    const session = await authInstance.api.getSession({ headers })
    if (!session) {
      return status(401)
    }
    return {
      user: session.user,
      session: session.session
    }
  }
)
