import type { TableProps } from 'tdesign-react'
import type { User } from '@/global/api'
import { postAuthRbacListUsers } from '@/global/api'

type SearchFormProps = Parameters<typeof GlSearchForm>[0]

export default () => {
  const searchForm = {
    items: Array.from({ length: 13 }).map((_value, index) => {
      return {
        formItem: {
          name: `prop${index}`,
          label: `属性${index}`
        },
        component: <Input />
      }
    })
  } satisfies SearchFormProps

  const columns = [
    {
      colKey: 'id',
      title: 'ID',
      minWidth: 150
    },
    {
      colKey: 'name',
      title: '姓名',
      minWidth: 150
    },
    {
      colKey: 'username',
      title: '用户名',
      minWidth: 150
    },
    {
      colKey: 'displayUsername',
      title: '显示名',
      minWidth: 150
    },
    {
      colKey: 'email',
      title: '邮箱',
      minWidth: 150
    },
    {
      colKey: 'emailVerified',
      title: '邮箱是否已验证',
      minWidth: 150
    },
    {
      colKey: 'createdAt',
      title: '创建时间',
      minWidth: 150
    },
    {
      colKey: 'updatedAt',
      title: '更新时间',
      minWidth: 150
    }
  ] satisfies TableProps['columns']
  const [data, setData] = useState<User[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    postAuthRbacListUsers({ body: {} }).then(res => {
      setData(res.data?.records!)
      setTotal(res.data?.total!)
    })
  }, [])

  return (
    <GlTable
      rowKey='id'
      searchForm={searchForm}
      columns={columns}
      data={data}
      pagination={{ total }}
    />
  )
}
