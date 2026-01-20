import type { TdListProps } from 'tdesign-mobile-react'
import type { PostPortalTreasureListResponse } from '@/global/api'
import { postPortalTreasureList } from '@/global/api'
import type { Route } from './+types/_index'

export const meta = () => {
  return [{ title: 'Youde Portal' }, { name: 'description', content: 'Welcome to Youde Portal' }]
}

export const loader = async () => {
  const { data = { records: [], total: 0 } } = await postPortalTreasureList({
    body: { page: 1, pageSize: 10 }
  })
  return data
}

export default ({ loaderData }: Route.ComponentProps) => {
  const { t } = useTranslation()
  const [loadingText, setLoadingText] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const page = useRef(1)
  const total = useRef(loaderData.total)

  const records = useRef<PostPortalTreasureListResponse['records']>(loaderData.records)

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
    const res = await postPortalTreasureList({
      body: { page: page.current, pageSize: 10, ...useSearchStore.getState().value }
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

  useEffect(() => {
    emitter.on('search', () => {
      setRefreshing(true)
      fetchRecords(true)
    })
  }, [])

  return (
    <PullDownRefresh
      value={refreshing}
      onChange={setRefreshing}
      onRefresh={onRefresh}
      className='overflow-auto!'
    >
      <List asyncLoading={loadingText} onScroll={onScroll}>
        {records.current.length ? (
          records.current.map(item => {
            return (
              <Cell
                key={item.id}
                align='middle'
                title={item.title}
                description={item.description}
              />
            )
          })
        ) : (
          <Empty description={t('label.noDate')} />
        )}
      </List>
    </PullDownRefresh>
  )
}
