import type { ResourceNode } from '@/global/api'
import { postAuthRbacListResourceTree } from '@/global/api'
import { AddBtn } from './components/add-btn'
import { DeleteBtn } from './components/delete-btn'
import { UpsertBtn } from './components/upsert-btn'

export default () => {
  const [data, setData] = useState<ResourceNode[] | null>(null)
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [loading, setLoading] = useState(false)

  const getTree = async () => {
    try {
      setLoading(true)
      await postAuthRbacListResourceTree().then(res => {
        setData(res.data ?? [])
      })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getTree()
  }, [])
  return (
    <Loading loading={loading} className='h-full w-full'>
      {data ? (
        <div className='flex flex-col gap-4'>
          <div>
            <AddBtn refresh={getTree} />
          </div>
          <Tree
            data={data}
            keys={{ label: 'name', value: 'id', children: 'children' }}
            label={node => {
              const nodeData = node.data as ResourceNode
              const menuLocale = nodeData.locales?.find(o => o.field === 'name')
              const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
              return menuName
            }}
            operations={node => {
              const nodeData = node.data as ResourceNode
              return (
                <Space>
                  {nodeData.type === 'Element' ? null : (
                    <UpsertBtn rowData={nodeData} refresh={getTree} mode='add' />
                  )}
                  <UpsertBtn rowData={nodeData} refresh={getTree} mode='edit' />
                  <DeleteBtn rowData={nodeData} refresh={getTree} />
                </Space>
              )
            }}
          />
        </div>
      ) : null}
    </Loading>
  )
}
