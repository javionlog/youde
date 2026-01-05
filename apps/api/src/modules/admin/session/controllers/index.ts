import { adminGuardController } from '@/global/controllers'
import { createSession, deleteSession, getSession, listSessions } from '../services'
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
        return await createSession({ ...body, username, createdByUsername: username })
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
        return await deleteSession(body)
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
        return await getSession(query)
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
        return await listSessions(body)
      },
      {
        detail: { tags, description: 'List sessions' },
        body: listReqSpec,
        response: promiseListResSpec
      }
    )
)

export default app
