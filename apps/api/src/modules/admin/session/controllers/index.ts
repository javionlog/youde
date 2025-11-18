import { adminGuardController } from '@/global/controllers'
import {
  createAdminSession,
  deleteAdminSession,
  getAdminSession,
  listAdminSessions
} from '../services'
import {
  createReqSpec,
  deleteReqSpec,
  getReqSpec,
  listReqSpec,
  promiseListResSpec,
  promiseRowResSpec
} from '../specs'

const tags = ['Admin-Session']

const app = adminGuardController.group('/session', app =>
  app
    .post(
      '',
      async ({ body, user }) => {
        const { username } = user
        return await createAdminSession({ ...body, username, createdByUsername: username })
      },
      {
        detail: {
          tags,
          description: 'Create session'
        },
        body: createReqSpec,
        response: promiseRowResSpec
      }
    )
    .delete(
      '',
      async ({ body }) => {
        return await deleteAdminSession(body)
      },
      {
        detail: {
          tags,
          description: 'Delete session'
        },
        body: deleteReqSpec
      }
    )
    .get(
      '',
      async ({ query }) => {
        return await getAdminSession(query)
      },
      {
        detail: {
          tags,
          description: 'Get session'
        },
        query: getReqSpec,
        response: promiseRowResSpec
      }
    )
    .post(
      '/list',
      async ({ body }) => {
        return await listAdminSessions(body)
      },
      {
        detail: { tags, description: 'List sessions' },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
