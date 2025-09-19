import type { TreeProps } from 'tdesign-react'
import type { ResourceNode } from '@/global/api'
import { postAuthRbacListResourceTree } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { MoreBtn } from './components/more-btn'
import { UpsertBtn } from './components/upsert-btn'

export default () => {
  const [data, setData] = useState<ResourceNode[] | null>(null)
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    try {
      setLoading(true)
      await postAuthRbacListResourceTree().then(res => {
        setData(res.data ?? [])
      })
    } finally {
      setLoading(false)
    }
  }

  const getLabel: TreeProps['label'] = node => {
    type NodeData = typeof node.data & ResourceNode
    const nodeData = node.data as NodeData
    const menuLocale = nodeData.locales?.find(o => o.field === 'name')
    const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
    return <GlEllipsis>{menuName}</GlEllipsis>
  }
  useEffect(() => {
    refresh()
  }, [])

  return (
    <Loading loading={loading} className='h-full w-full'>
      {data ? (
        <div className='flex flex-col gap-4'>
          <div>
            <UpsertBtn refresh={refresh} />
          </div>
          <Tree
            data={data}
            keys={{ value: 'id', children: 'children' }}
            label={getLabel}
            operations={node => {
              const nodeData = node.data as ResourceNode
              return (
                <Space>
                  {nodeData.type === 'Element' ? null : (
                    <UpsertBtn rowData={nodeData} refresh={refresh} mode='add' />
                  )}
                  <UpsertBtn rowData={nodeData} refresh={refresh} mode='edit' />
                  <DeleteBtn rowData={nodeData} refresh={refresh} />
                  <MoreBtn rowData={nodeData} />
                </Space>
              )
            }}
          />
        </div>
      ) : null}
    </Loading>
  )
}
