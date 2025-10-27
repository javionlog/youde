import type { TdListProps } from 'tdesign-mobile-react'
import type { PostGuestThingListResponse } from '@/global/api'
import { postGuestThingList } from '@/global/api'
import type { Route } from './+types/_index'

export const meta = () => {
  return [{ title: 'Youde Portal' }, { name: 'description', content: 'Welcome to Youde Portal' }]
}

export const loader = async () => {
  const result = await postGuestThingList({ body: { page: 1, pageSize: 10 } })
  return result
}

export default ({ loaderData }: Route.ComponentProps) => {
  const [loadingText, setLoadingText] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const page = useRef(1)
  const total = useRef(loaderData.data?.total ?? 0)
  const records = useRef<PostGuestThingListResponse['records']>(loaderData.data?.records ?? [])

  const fetchRecords = async (isRefresh = false) => {
    if ((records.current.length >= total.current && !isRefresh) || refreshing) {
      return
    }
    setLoadingText('loading')
    if (isRefresh) {
      page.current = 1
    } else {
      page.current += 1
    }
    const res = await postGuestThingList({
      body: { page: page.current, pageSize: 10 },
      baseUrl: '/api'
    }).then(r => r.data!)
    if (isRefresh) {
      records.current = res.records
    } else {
      records.current = [...records.current, ...res.records]
    }
    total.current = res.total
    setLoadingText('')
    setRefreshing(false)
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchRecords(true)
  }

  const onScroll: TdListProps['onScroll'] = bottomDistance => {
    if (bottomDistance < 50) {
      fetchRecords()
    }
  }

  return (
    <PullDownRefresh
      value={refreshing}
      onChange={setRefreshing}
      onRefresh={onRefresh}
      className='overflow-auto!'
    >
      <List asyncLoading={loadingText} onScroll={onScroll}>
        {records.current.map((item, index) => {
          return (
            <Cell key={item.id} align='middle'>
              {index + 1}、{item.title}
            </Cell>
          )
        })}
      </List>
    </PullDownRefresh>
  )
}
