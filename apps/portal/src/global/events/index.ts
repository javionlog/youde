import mitt from 'mitt'
import type { PostPortalTreasureListData } from '@/global/api'

type Events = {
  search: PostPortalTreasureListData['body']
}

export const emitter = mitt<Events>()
