import type { TreeProps } from 'tdesign-react'
import type { ResourceNode } from '@/global/api'
import { postAuthRbacListResourceTree } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { MoreBtn } from './components/more-btn'
import { UpsertBtn } from './components/upsert-btn'

export default () => {
  const { t } = useTranslation()
  const [data, setData] = useState<ResourceNode[] | null>(null)
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [loading, setLoading] = useState(false)
  const [elementVisible, setElementVisible] = useState(false)
  const [filterText, setFilterText] = useState('')

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
    const nodeData = node.data as ResourceNode
    const menuLocale = nodeData.locales?.find(o => o.field === 'name')
    const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
    return (
      <GlEllipsis>
        <span className=' mr-1 text-(--td-brand-color)'>
          [{getTranslate('RESOURCE_TYPE', nodeData.type)}]
        </span>
        <span>{menuName}</span>
      </GlEllipsis>
    )
  }

  const filterTree: TreeProps['filter'] = node => {
    const nodeData = node.data as ResourceNode
    const preCondition = elementVisible ? true : nodeData.type !== 'Element'
    if (filterText.trim() === '') {
      return preCondition
    }
    const menuLocale = nodeData.locales?.find(o => o.field === 'name')
    const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
    return preCondition && menuName.includes(filterText.trim())
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
          <div className='flex gap-3'>
            <Checkbox checked={elementVisible} onChange={setElementVisible} className='shrink-0'>
              {t('common.message.showElement', { ns: 'auth' })}
            </Checkbox>
            <InputAdornment append={t('action.search')}>
              <Input value={filterText} onChange={setFilterText} />
            </InputAdornment>
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
            filter={filterTree}
            expandAll
            allowFoldNodeOnFilter
          />
        </div>
      ) : null}
    </Loading>
  )
}
