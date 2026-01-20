import mitt from 'mitt'
import type { PostPortalTreasureListData } from '@/global/api'

type Events = {
  search: { title: PostPortalTreasureListData['body']['title'] }
}

export const emitter = mitt<Events>()
