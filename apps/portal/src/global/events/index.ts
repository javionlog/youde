import mitt from 'mitt'

type Events = {
  search: { value: string }
}

export const emitter = mitt<Events>()
