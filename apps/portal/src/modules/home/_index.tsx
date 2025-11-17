// import type { TdListProps } from 'tdesign-mobile-react'
// import type { PostGuestThingListResponse } from '@/global/api'
// import { postGuestThingList } from '@/global/api'
// import type { Route } from './+types/_index'

// const defaultPageSize = 20

// export const meta = () => {
//   return [{ title: 'Youde Portal' }, { name: 'description', content: 'Welcome to Youde Portal' }]
// }

// export const loader = async () => {
//   const result = await postGuestThingList({ body: { page: 1, pageSize: defaultPageSize } })
//   return result.data
// }

// export default ({ loaderData }: Route.ComponentProps) => {
//   const [loadingText, setLoadingText] = useState('')
//   const [refreshing, setRefreshing] = useState(false)
//   const page = useRef(1)
//   const total = useRef(loaderData?.total ?? 0)
//   const records = useRef<PostGuestThingListResponse['records']>(loaderData?.records ?? [])

//   const fetchRecords = async (isRefresh = false) => {
//     if ((records.current.length >= total.current && !isRefresh) || refreshing) {
//       return
//     }
//     setLoadingText('loading')
//     setRefreshing(true)
//     if (isRefresh) {
//       page.current = 1
//     } else {
//       page.current += 1
//     }
//     const res = await postGuestThingList({
//       body: { page: page.current, pageSize: defaultPageSize }
//     }).then(r => r.data!)
//     if (isRefresh) {
//       records.current = res.records
//     } else {
//       records.current = [...records.current, ...res.records]
//     }
//     total.current = res.total
//     setLoadingText('')
//     setRefreshing(false)
//   }

//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchRecords(true)
//   }

//   const onScroll: TdListProps['onScroll'] = bottomDistance => {
//     if (bottomDistance < 50) {
//       fetchRecords()
//     }
//   }

//   return (
//     <PullDownRefresh
//       value={refreshing}
//       onChange={setRefreshing}
//       onRefresh={onRefresh}
//       className='overflow-auto!'
//     >
//       <List asyncLoading={loadingText} onScroll={onScroll}>
//         {records.current.map((item, index) => {
//           return (
//             <Cell key={item.id} align='middle'>
//               {index + 1}、{item.title}
//             </Cell>
//           )
//         })}
//       </List>
//     </PullDownRefresh>
//   )
// }
export const meta = () => {
  return [{ title: '首页' }, { name: 'description', content: '首页' }]
}

export default () => {
  return <div>首页</div>
}
