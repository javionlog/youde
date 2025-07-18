import { Elysia, t } from 'elysia'

const app = new Elysia().get(
  '/aticle',
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
