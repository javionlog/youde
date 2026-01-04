import type { TreeProps } from 'tdesign-react'
import type { TreasureCategoryNode } from '@/global/api'
import { postAdminTreasureCategoryTree } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { MoreBtn } from './components/more-btn'
import { UpsertBtn } from './components/upsert-btn'

export const CategoryPanel = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<TreasureCategoryNode[] | null>(null)
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [loading, setLoading] = useState(false)
  const [filterText, setFilterText] = useState('')

  const refresh = async () => {
    try {
      setLoading(true)
      await postAdminTreasureCategoryTree({ body: {} }).then(res => {
        setData(res.data ?? [])
      })
    } finally {
      setLoading(false)
    }
  }

  const getLabel: TreeProps['label'] = node => {
    const nodeData = node.data as TreasureCategoryNode
    const categoryLocale = nodeData.locales?.find(o => o.field === 'name')
    const categoryName = categoryLocale?.[lang as 'enUs'] ?? nodeData.name
    return <GlEllipsis>{categoryName}</GlEllipsis>
  }

  const filterTree: TreeProps['filter'] = node => {
    const nodeData = node.data as TreasureCategoryNode
    if (filterText.trim() === '') {
      return true
    }
    const categoryLocale = nodeData.locales?.find(o => o.field === 'name')
    const categoryName = categoryLocale?.[lang as 'enUs'] ?? nodeData.name
    return categoryName.includes(filterText.trim())
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <Loading loading={loading} className='h-full w-full'>
      {data ? (
        <div className='mt-4 flex flex-col gap-4'>
          <div>
            <UpsertBtn refresh={refresh} />
          </div>
          <GlGrid maxRows={10} columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }}>
            <GlGridItem index={1}>
              <GlInputAdornment prepend={t('action.search')}>
                <GlInput value={filterText} onChange={setFilterText} className='min-w-0' />
              </GlInputAdornment>
            </GlGridItem>
          </GlGrid>
          <Tree
            data={data}
            keys={{ value: 'id', children: 'children' }}
            label={getLabel}
            operations={node => {
              const nodeData = node.data as TreasureCategoryNode

              return (
                <Space>
                  <UpsertBtn rowData={nodeData} refresh={refresh} mode='add' />
                  <UpsertBtn rowData={nodeData} refresh={refresh} mode='edit' />
                  <DeleteBtn rowData={nodeData} refresh={refresh} />
                  <MoreBtn rowData={nodeData} refresh={refresh} />
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
