import type { TreeProps } from 'tdesign-react'
import type { ResourceNode, User } from '@/global/api'
import { postAuthRbacListUserResourceTree } from '@/global/api'

interface Props {
  rowData: User
}

interface DialogBodyProps {
  rowData: User
}

const DialogBody = (props: DialogBodyProps) => {
  const { rowData } = props

  const { t } = useTranslation()
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [resourceTree, setResourceTree] = useState<ResourceNode[]>([])
  const [loading, setLoading] = useState(false)
  const [elementVisible, setElementVisible] = useState(false)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const treeList = await postAuthRbacListUserResourceTree({
          body: { userId: rowData.id }
        }).then(r => r.data ?? [])
        setResourceTree(treeList)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

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

  return (
    <Loading loading={loading}>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-3'>
          <Checkbox checked={elementVisible} onChange={setElementVisible} className='shrink-0'>
            {t('common.message.showElement', { ns: 'auth' })}
          </Checkbox>
          <InputAdornment append={t('action.search')}>
            <Input value={filterText} onChange={setFilterText} />
          </InputAdornment>
        </div>
        <Tree
          data={resourceTree}
          keys={{ value: 'id', children: 'children' }}
          label={getLabel}
          filter={filterTree}
          expandAll
          allowFoldNodeOnFilter
        />
      </div>
    </Loading>
  )
}

export const useTree = (props: Props) => {
  const { rowData } = props

  const { t } = useTranslation()
  const text = t('common.action.viewAssociatedResource', { ns: 'auth' })

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: text,
      footer: false,
      body: <DialogBody rowData={rowData} />
    })
  }

  return {
    t,
    text,
    onOpen
  }
}
