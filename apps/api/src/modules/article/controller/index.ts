import { t } from 'elysia'
import { guardController } from '@/modules/shared/controller'

const app = guardController.get(
  '/article',
  async ({ query }) => {
    const { id } = query
    return {
      id,
      title: 'Hello',
      content: 'This is a good article.'
    }
  },
  {
    tags: ['Article'],
    query: t.Object({ id: t.String({ minLength: 1 }) }),
    response: {
      200: t.Object({
        id: t.String(),
        title: t.String(),
        content: t.String()
      })
    }
  }
)

export default app
