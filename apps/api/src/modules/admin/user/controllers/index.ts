import { ADMIN_SESSION_MAX_AGE } from '@/global/config'
import { adminGuardController } from '@/global/controllers'
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUser,
  listAdminUsers,
  listResourceAdminUsers,
  listRoleAdminUsers,
  resetAdminUserPassword,
  resetSelfAdminUserPassword,
  signIn,
  signOut,
  updateAdminUser
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  listResourceUsersReqSpec,
  listRoleUsersReqSpec,
  promiseListResSpec,
  promiseRowResSpec,
  promiseSignInResSpec,
  resetPasswordReqSpec,
  resetSelfPasswordReqSpec,
  signInReqSpec,
  updateReqSpec
} from '../specs'

const tags = ['Admin-User']

const app = adminGuardController.group('/user', app =>
  app
    .post(
      '/sign-in',
      async ({ headers, cookie, body, server, request }) => {
        const requestIp = server?.requestIP(request)
        const result = await signIn({
          ...body,
          userAgent: headers['user-agent'],
          ipAddress: requestIp ? String(requestIp) : undefined
        })
        cookie.sessionToken.set({
          value: result.token,
          maxAge: ADMIN_SESSION_MAX_AGE
        })
        return result
      },
      {
        detail: {
          tags,
          description: 'User sign in'
        },
        body: signInReqSpec,
        response: promiseSignInResSpec
      }
    )
    .post(
      '/sign-out',
      async ({ cookie }) => {
        const token = String(cookie.sessionToken.value)
        const result = await signOut({ token })
        cookie.sessionToken.remove()
        return result
      },
      {
        detail: {
          tags,
          description: 'User sign out'
        }
      }
    )
    .patch(
      '/password',
      async ({ body, user }) => {
        const { username } = user
        return await resetAdminUserPassword({ ...body, updatedByUsername: username })
      },
      {
        detail: {
          tags,
          description: 'Reset user password'
        },
        body: resetPasswordReqSpec
      }
    )
    .patch(
      '/self-password',
      async ({ status, cookie, body, user }) => {
        const { username, id } = user
        await resetSelfAdminUserPassword({
          ...body,
          updatedByUsername: username,
          currentUserId: id
        })
        const token = String(cookie.sessionToken.value)
        await signOut({ token })
        cookie.sessionToken.remove()
        return status(401)
      },
      {
        detail: {
          tags,
          description: 'Reset self password'
        },
        body: resetSelfPasswordReqSpec
      }
    )
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createAdminUser({ ...body, createdByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Create user'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .patch(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await updateAdminUser({ ...body, updatedByUsername: username! })
      },
      {
        detail: {
          tags,
          description: 'Update user'
        },
        body: updateReqSpec,
        response: promiseRowResSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteAdminUser(body)
      },
      {
        detail: {
          tags,
          description: 'Delete user'
        },
        body: deleteReqSpec
      }
    )
    .get(
      '',
      async ({ query }) => {
        return await getAdminUser(query)
      },
      {
        detail: {
          tags,
          description: 'Get user'
        },
        query: getReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listAdminUsers(body)
      },
      {
        detail: { tags, description: 'Update user list' },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
    .post(
      '/role-user-list',
      async ({ body }) => {
        return await listRoleAdminUsers(body)
      },
      {
        detail: { tags, description: 'Update user list' },
        body: listRoleUsersReqSpec,
        response: promiseListResSpec
      }
    )
    .post(
      '/resource-user-list',
      async ({ body }) => {
        return await listResourceAdminUsers(body)
      },
      {
        detail: { tags, description: 'Update user list' },
        body: listResourceUsersReqSpec,
        response: promiseListResSpec
      }
    )
)
export default app
